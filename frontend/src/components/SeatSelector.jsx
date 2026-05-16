import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/SeatSelector.css";

const createDemoSeats = () => {
  const bookedSeats = {
    L2: "MALE",
    L9: "FEMALE",
    L14: "MALE",
    U4: "FEMALE",
    U11: "MALE",
    U17: "FEMALE",
  };
  const seats = [];

  ["L", "U"].forEach((deck) => {
    for (let index = 1; index <= 18; index += 1) {
      const seatNumber = `${deck}${index}`;
      seats.push({
        id: `demo-${seatNumber}`,
        seatNumber,
        seatStatus: bookedSeats[seatNumber] ? "BOOKED" : "AVAILABLE",
        occupiedGender: bookedSeats[seatNumber] || null,
        rowNumber: Math.ceil(index / 3),
        columnNumber: ((index - 1) % 3) + 1,
      });
    }
  });

  return seats;
};

const buildSleeperDecks = (seats) => {
  const sortedSeats = [...seats].sort((a, b) => {
    const rowDiff = (a.rowNumber || 0) - (b.rowNumber || 0);
    return rowDiff || (a.columnNumber || 0) - (b.columnNumber || 0);
  });

  const normalizedSeats = sortedSeats.slice(0, 36).map((seat, index) => {
    const deck = index < 18 ? "lower" : "upper";
    const deckIndex = deck === "lower" ? index + 1 : index - 17;

    return {
      ...seat,
      deck,
      berthNumber: deckIndex,
      displayNumber: `${deck === "lower" ? "L" : "U"}${deckIndex}`,
      layoutRow: Math.ceil(deckIndex / 3),
      layoutColumn: ((deckIndex - 1) % 3) + 1,
    };
  });

  return {
    lower: normalizedSeats.filter((seat) => seat.deck === "lower"),
    upper: normalizedSeats.filter((seat) => seat.deck === "upper"),
  };
};

function SeatSelector({ scheduleId, onSeatsSelected }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
    // fetchSeats is intentionally scoped to the current scheduleId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  const fetchSeats = async () => {
    try {
      const response = await api.get(`/seats/${scheduleId}`);
      setSeats(response.data.length ? response.data : createDemoSeats());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching seats:", error);
      setSeats(createDemoSeats());
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.seatStatus === "AVAILABLE") {
      setSelectedSeats((prev) => {
        const exists = prev.find((s) => s.id === seat.id);
        if (exists) {
          return prev.filter((s) => s.id !== seat.id);
        } else {
          return [...prev, { ...seat, allowedGender: getSeatRestrictionGender(seat) }];
        }
      });
    }
  };

  const handleConfirm = () => {
    onSeatsSelected(selectedSeats);
  };

  if (loading) return <div className="seat-loader">Loading seats...</div>;

  const sleeperDecks = buildSleeperDecks(seats);
  const allLayoutSeats = [...sleeperDecks.lower, ...sleeperDecks.upper];

  const getAdjacentSideSeat = (seat) => {
    if (![2, 3].includes(seat.layoutColumn)) return null;

    return allLayoutSeats.find(
      (candidate) =>
        candidate.deck === seat.deck &&
        candidate.layoutRow === seat.layoutRow &&
        candidate.layoutColumn === (seat.layoutColumn === 2 ? 3 : 2)
    );
  };

  const getSeatRestrictionGender = (seat) => {
    if (seat.seatStatus !== "AVAILABLE") return null;

    const adjacentSeat = getAdjacentSideSeat(seat);
    return adjacentSeat?.occupiedGender || null;
  };

  const renderDeck = (title, deckSeats) => {
    const rows = {};

    deckSeats.forEach((seat) => {
      if (!rows[seat.layoutRow]) {
        rows[seat.layoutRow] = [];
      }
      rows[seat.layoutRow].push(seat);
    });

    return (
      <section className="sleeper-deck">
        <div className="deck-header">
          <h3>{title}</h3>
          <span>
            {deckSeats.filter((seat) => seat.seatStatus === "AVAILABLE").length} available
          </span>
        </div>
        {title === "Lower" && (
          <div className="driver-row">
            <span className="door-label">Entry</span>
            <span className="driver-cabin" aria-label="Driver steering wheel">
              <span className="steering-wheel" aria-hidden="true" />
            </span>
          </div>
        )}
        <div className="sleeper-rows">
          {Object.keys(rows)
            .sort((a, b) => a - b)
            .map((rowNum) => {
              const rowSeats = rows[rowNum].sort((a, b) => a.layoutColumn - b.layoutColumn);
              const singleSeat = rowSeats.find((seat) => seat.layoutColumn === 1);
              const doubleSeats = rowSeats.filter((seat) => seat.layoutColumn !== 1);

              return (
                <div key={rowNum} className="sleeper-row">
                  <div className="single-berth">
                    {singleSeat && renderSeat(singleSeat)}
                  </div>
                  <div className="aisle" aria-hidden="true" />
                  <div className="double-berths">
                    {doubleSeats.map(renderSeat)}
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    );
  };

  const renderSeat = (seat) => {
    const isSelected = selectedSeats.find((selected) => selected.id === seat.id);
    const genderLabel = seat.occupiedGender === "FEMALE" ? "L" : seat.occupiedGender === "MALE" ? "G" : "";
    const restrictionGender = getSeatRestrictionGender(seat);
    const restrictionLabel =
      restrictionGender === "FEMALE" ? "L" : restrictionGender === "MALE" ? "G" : "";

    return (
      <button
        key={seat.id}
        className={`sleeper-seat ${seat.seatStatus.toLowerCase()} ${
          isSelected ? "selected" : ""
        } ${
          restrictionGender === "FEMALE" ? "female-available" : ""
        } ${
          restrictionGender === "MALE" ? "male-available" : ""
        } ${
          seat.occupiedGender === "FEMALE" ? "ladies-booked" : ""
        } ${
          seat.occupiedGender === "MALE" ? "gents-booked" : ""
        }`}
        onClick={() => toggleSeat({ ...seat, seatNumber: seat.displayNumber })}
        disabled={seat.seatStatus !== "AVAILABLE"}
        title={
          restrictionGender
            ? `${seat.displayNumber} - only for ${restrictionGender === "FEMALE" ? "Ladies" : "Gents"}`
            : `${seat.displayNumber} - ${seat.seatStatus}`
        }
      >
        <span>{seat.displayNumber}</span>
        {(genderLabel || restrictionLabel) && (
          <small className={genderLabel ? "booked-gender-mark" : "allowed-gender-mark"}>
            {genderLabel || restrictionLabel}
          </small>
        )}
      </button>
    );
  };

  return (
    <div className="seat-selector-container">
      <h2>Select Your Seats</h2>
      <p className="seat-info">Select AC sleeper berths from the lower or upper deck</p>
      <div className="seat-policy-note">
        Seats marked only for Ladies or Gents are based on adjacent booked berths. Your selected seats appear in red.
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat male-available"></div>
          <span>Only for Gents</span>
        </div>
        <div className="legend-item">
          <div className="seat female-available"></div>
          <span>Only for Ladies</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Your selected seat</span>
        </div>
        <div className="legend-item">
          <div className="seat ladies-booked"></div>
          <span>Ladies booked</span>
        </div>
        <div className="legend-item">
          <div className="seat gents-booked"></div>
          <span>Gents booked</span>
        </div>
      </div>

      <div className="sleeper-layout">
        {renderDeck("Lower", sleeperDecks.lower)}
        {renderDeck("Upper", sleeperDecks.upper)}
      </div>

      <div className="selected-seats">
        <h3>Selected Seats: {selectedSeats.length}</h3>
        <p className="seats-list">
          {selectedSeats.length > 0
            ? selectedSeats.map((s) => s.seatNumber).join(", ")
            : "No seats selected by you"}
        </p>
      </div>

      <button
        className="confirm-button"
        onClick={handleConfirm}
        disabled={selectedSeats.length === 0}
      >
        Confirm Selection ({selectedSeats.length} seats)
      </button>
    </div>
  );
}

export default SeatSelector;
