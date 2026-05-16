import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const message = response.data.message || "Registration successful";

      if (message.toLowerCase().includes("exists") || message.toLowerCase().includes("please")) {
        setStatus({ type: "error", message });
        return;
      }

      setStatus({ type: "success", message: "Account created. Please login to continue." });
      setTimeout(() => navigate("/login"), 700);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Registration failed. Please check backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <span>TravelGo Bus</span>
        <h1>Create your bus booking account</h1>
        <p>Save passenger details, manage bookings, and checkout faster on popular routes.</p>
      </section>

      <section className="auth-card">
        <p className="auth-kicker">Register</p>
        <h2>Start booking in minutes</h2>
        <p className="auth-copy">Your account helps personalize offers, trips, and booking history.</p>

        <form onSubmit={handleRegister} className="auth-form">
          <label>
            Full name
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </label>

          {status.message && (
            <div className={`auth-message ${status.type}`}>{status.message}</div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
