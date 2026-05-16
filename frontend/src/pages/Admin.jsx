import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "../styles/Admin.css";

function Admin() {
  const [summary, setSummary] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/summary").then((response) => response.data).catch(() => null),
      api.post("/search", { sortBy: "PRICE" }).then((response) => response.data).catch(() => []),
    ]).then(([summaryData, busesData]) => {
      setSummary(summaryData);
      setBuses(busesData);
    }).finally(() => setLoading(false));
  }, []);

  const localBookings = useMemo(
    () => JSON.parse(localStorage.getItem("bookingHistory") || "[]"),
    []
  );

  const stats = {
    registeredUsers: summary?.registeredUsers || 0,
    activeUsers: summary?.activeUsers || 0,
    customerUsers: summary?.customerUsers || 0,
    adminUsers: summary?.adminUsers || 0,
    bookings: (summary?.totalBookings || 0) + localBookings.length,
    ticketsBooked:
      (summary?.ticketsBooked || 0) +
      localBookings.reduce((sum, booking) => {
        const seatNumbers = booking.seatNumbers || "";
        return sum + seatNumbers.split(",").filter(Boolean).length;
      }, 0),
    revenue:
      (summary?.totalRevenue || 0) +
      localBookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0),
    buses: summary?.activeBuses || buses.length,
  };

  const recentBookings = [
    ...localBookings,
    ...(summary?.recentBookings || []),
  ];

  const formatDate = (value) => {
    if (!value) return "Not logged in";
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
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p>Admin dashboard</p>
          <h1>TravelGo Operations</h1>
          <span>Live users, booking activity, revenue, tickets, and bus inventory.</span>
        </div>
        <strong>{loading ? "Syncing" : "Live"}</strong>
      </section>

      <section className="admin-stats">
        <div>
          <span>Registered users</span>
          <strong>{stats.registeredUsers}</strong>
          <small>{stats.customerUsers} customers · {stats.adminUsers} admins</small>
        </div>
        <div>
          <span>Recently active users</span>
          <strong>{stats.activeUsers}</strong>
          <small>Logged in during last 30 minutes</small>
        </div>
        <div>
          <span>Tickets booked</span>
          <strong>{stats.ticketsBooked}</strong>
          <small>{stats.bookings} booking records</small>
        </div>
        <div>
          <span>Total revenue</span>
          <strong>Rs {Math.round(stats.revenue)}</strong>
          <small>Online payments captured</small>
        </div>
        <div>
          <span>Active buses</span>
          <strong>{stats.buses}</strong>
          <small>Schedules available for booking</small>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-title">
          <h2>Recent users</h2>
          <span>{summary?.recentUsers?.length || 0} users</span>
        </div>
        <div className="admin-table">
          <div className="admin-row head users">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Registered</span>
            <span>Last login</span>
          </div>
          {(summary?.recentUsers || []).map((user) => (
            <div className="admin-row users" key={user.email}>
              <span>{user.fullName || "User"}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <span>{formatDate(user.createdAt)}</span>
              <span>{formatDate(user.lastLoginAt)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-title">
          <h2>Recent bookings</h2>
          <span>{recentBookings.length} records</span>
        </div>
        <div className="admin-table">
          <div className="admin-row head">
            <span>Passenger</span>
            <span>Route / Bus</span>
            <span>Seats</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {recentBookings.slice(0, 12).map((booking, index) => (
            <div className="admin-row" key={`${booking.id || booking.transactionId}-${index}`}>
              <span>{booking.userName || booking.passengers?.[0]?.name || "Traveller"}</span>
              <span>{booking.route || booking.schedule?.route?.sourceCity || booking.busName || "TravelGo Bus"}</span>
              <span>{booking.seatNumbers || "-"}</span>
              <span>Rs {Math.round(booking.totalAmount || 0)}</span>
              <span>{booking.bookingStatus || "CONFIRMED"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-title">
          <h2>Bus inventory</h2>
          <span>{buses.length} schedules</span>
        </div>
        <div className="admin-table">
          <div className="admin-row head bus">
            <span>Operator</span>
            <span>Route</span>
            <span>Type</span>
            <span>Seats</span>
            <span>Fare</span>
          </div>
          {buses.map((bus) => (
            <div className="admin-row bus" key={bus.scheduleId}>
              <span>{bus.busName}</span>
              <span>{bus.sourceCity} to {bus.destinationCity}</span>
              <span>{bus.busType}</span>
              <span>{bus.availableSeats}/{bus.totalSeats}</span>
              <span>Rs {Math.round(bus.fare)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Admin;
