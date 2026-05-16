import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Bookings.css";

function Bookings() {
  const navigate = useNavigate();
  const [backendBookings, setBackendBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings")
      .then((response) => {
        setBackendBookings(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const bookings = useMemo(() => {
    const localBookings = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
    const formattedBackendBookings = backendBookings.map((booking) => ({
      id: `BK-${booking.id}`,
      transactionId: `BK-${booking.id}`,
      scheduleId: booking.schedule?.id,
      busName: booking.schedule?.bus?.busName || "TravelGo Bus",
      busNumber: booking.schedule?.bus?.busNumber || "Confirmed operator",
      route: booking.schedule?.route
        ? `${booking.schedule.route.sourceCity} to ${booking.schedule.route.destinationCity}`
        : "Route details",
      departureTime: booking.schedule?.departureTime,
      arrivalTime: booking.schedule?.arrivalTime,
      seatNumbers: booking.seatNumbers,
      userName: booking.userName,
      userEmail: booking.userEmail,
      totalAmount: booking.totalAmount,
      bookingStatus: booking.bookingStatus,
      bookingTime: booking.bookingTime,
      paymentMethod: "Online",
    }));

    const merged = [...localBookings, ...formattedBackendBookings];
    const seen = new Set();

    return merged.filter((booking) => {
      const key = `${booking.transactionId}-${booking.seatNumbers}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [backendBookings]);

  const formatDate = (value) => {
    if (!value) return "Recently booked";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="bookings-page">
      <section className="bookings-header">
        <div>
          <p>Booking history</p>
          <h1>My Bookings</h1>
          <span>Confirmed tickets, seats, fares, and traveller details in one place.</span>
        </div>
        <strong>{bookings.length} booking{bookings.length === 1 ? "" : "s"}</strong>
      </section>

      {loading ? (
        <div className="booking-empty">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="booking-empty">
          <h2>No bookings yet</h2>
          <p>Complete a payment and your ticket will appear here.</p>
        </div>
      ) : (
        <section className="booking-list">
          {bookings.map((booking) => (
            <article className="booking-card" key={`${booking.id}-${booking.transactionId}`}>
              <div className="booking-card-top">
                <div>
                  <h2>{booking.busName}</h2>
                  <p>{booking.busNumber}</p>
                </div>
                <span className="status-pill">{booking.bookingStatus || "CONFIRMED"}</span>
              </div>

              <div className="booking-route">
                <strong>{booking.route}</strong>
                <span>{formatDate(booking.departureTime || booking.bookingTime)}</span>
              </div>

              <div className="booking-grid">
                <div>
                  <span>Passenger</span>
                  <strong>{booking.userName || "Traveller"}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{booking.userEmail || "Not provided"}</strong>
                </div>
                <div>
                  <span>Seats</span>
                  <strong>{booking.seatNumbers}</strong>
                </div>
                <div>
                  <span>Amount paid</span>
                  <strong>Rs {Math.round(booking.totalAmount || 0)}</strong>
                </div>
                <div>
                  <span>Transaction</span>
                  <strong>{booking.transactionId}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>{String(booking.paymentMethod || "Online").replace(/_/g, " ")}</strong>
                </div>
              </div>
              {booking.scheduleId && (
                <button
                  className="track-bus-btn"
                  onClick={() => navigate(`/tracking?scheduleId=${booking.scheduleId}`)}
                >
                  Track Bus
                </button>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Bookings;
