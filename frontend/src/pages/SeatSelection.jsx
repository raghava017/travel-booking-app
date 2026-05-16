import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeatSelector from "../components/SeatSelector";
import PassengerForm from "../components/PassengerForm";
import "../styles/SeatSelection.css";

function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const bus = location.state?.bus;
  const pageTopRef = useRef(null);

  const [stage, setStage] = useState("seats");
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    pageTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stage]);

  if (!bus) {
    return (
      <div className="error-container">
        <p>Bus information not found. Please search again.</p>
        <button onClick={() => navigate("/search")}>Back to Search</button>
      </div>
    );
  }

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
    setStage("passengers");
  };

  const handlePassengersSubmit = (passengersList) => {
    navigate("/payment", {
      state: { bus, selectedSeats, passengers: passengersList },
    });
  };

  const handleBackToSeats = () => {
    setStage("seats");
  };

  return (
    <div className="seat-selection-page">
      <div className="selection-header" ref={pageTopRef}>
        <h1>{bus.busName}</h1>
        <p className="route-info">
          {bus.sourceCity} to {bus.destinationCity}
        </p>
        <div className="stage-indicator">
          <div className={`stage ${stage === "seats" ? "active" : stage === "passengers" ? "completed" : ""}`}>
            1. Select Seats
          </div>
          <div className={`stage ${stage === "passengers" ? "active" : ""}`}>
            2. Passenger Details
          </div>
        </div>
      </div>

      <div className="selection-content">
        {stage === "seats" ? (
          <SeatSelector scheduleId={bus.scheduleId} onSeatsSelected={handleSeatsSelected} />
        ) : (
          <div>
            <PassengerForm selectedSeats={selectedSeats} onSubmit={handlePassengersSubmit} />
            <button className="back-button" onClick={handleBackToSeats}>
              Back to Seat Selection
            </button>
          </div>
        )}
      </div>

      <div className="price-summary">
        <h3>Price Summary</h3>
        <div className="summary-item">
          <span>Base Fare (per seat)</span>
          <span>Rs {Math.round(bus.fare)}</span>
        </div>
        {selectedSeats.length > 0 && (
          <>
            <div className="summary-item">
              <span>Number of Seats</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>Rs {Math.round(bus.fare * selectedSeats.length)}</span>
            </div>
            <div className="summary-item">
              <span>Taxes & Fees</span>
              <span>Rs {Math.round(bus.fare * selectedSeats.length * 0.05)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs {Math.round(bus.fare * selectedSeats.length * 1.05)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SeatSelection;
