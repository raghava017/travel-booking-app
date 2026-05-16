import "../styles/BusCard.css";

function BusCard({ bus, onSelectBus }) {
  const formatTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getDuration = () => {
    const departure = new Date(bus.departureTime);
    const arrival = new Date(bus.arrivalTime);
    const diff = arrival - departure;

    if (Number.isNaN(diff) || diff <= 0) return "Overnight";

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.round((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const seatFill = Math.max(
    0,
    Math.min(100, ((bus.totalSeats - bus.availableSeats) / bus.totalSeats) * 100)
  );

  const seatsLabel =
    bus.availableSeats <= 10 ? "Few seats left" : `${bus.availableSeats} seats available`;

  return (
    <article className="bus-card">
      <div className="bus-main">
        <div className="operator-block">
          <div className="operator-row">
            <div>
              <h3>{bus.busName}</h3>
              <p>{bus.busNumber}</p>
            </div>
            <span className="bus-type">{bus.busType}</span>
          </div>
          <div className="rating-row">
            <span className="rating-pill">{Number(bus.rating).toFixed(1)} ★</span>
            <span>{bus.reviewCount} reviews</span>
            <span className="punctuality">On-time partner</span>
          </div>
        </div>

        <div className="timeline-block">
          <div className="route-point">
            <strong>{formatTime(bus.departureTime)}</strong>
            <span>{bus.sourceCity}</span>
          </div>
          <div className="duration-line">
            <span>{getDuration()}</span>
          </div>
          <div className="route-point right">
            <strong>{formatTime(bus.arrivalTime)}</strong>
            <span>{bus.destinationCity}</span>
          </div>
        </div>

        <div className="fare-block">
          <span>Starts from</span>
          <strong>Rs {Math.round(bus.fare)}</strong>
          <small>per seat</small>
          <button onClick={() => onSelectBus(bus)} disabled={bus.availableSeats === 0}>
            View seats
          </button>
        </div>
      </div>

      <div className="bus-meta">
        <div className="seat-meter">
          <div>
            <strong>{seatsLabel}</strong>
            <span>{bus.totalSeats} total seats</span>
          </div>
          <div className="occupancy-bar">
            <span style={{ width: `${seatFill}%` }} />
          </div>
        </div>

        <div className="amenities">
          {bus.amenities.slice(0, 4).map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>

        <div className="points-row">
          <span>Boarding: {bus.boardingPoints.slice(0, 2).join(", ")}</span>
          <span>Dropping: {bus.droppingPoints.slice(0, 2).join(", ")}</span>
          <span>{bus.cancellation}</span>
        </div>
      </div>
    </article>
  );
}

export default BusCard;
