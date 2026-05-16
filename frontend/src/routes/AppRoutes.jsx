import { Navigate, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Search from "../pages/Search";
import SeatSelection from "../pages/SeatSelection";
import Payment from "../pages/Payment";
import Bookings from "../pages/Bookings";
import Admin from "../pages/Admin";
import Tracking from "../pages/Tracking";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Admin />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<Search />} />
      <Route path="/seat-selection" element={<SeatSelection />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute />} />
    </Routes>
  );
}

export default AppRoutes;
