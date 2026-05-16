import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (!response.data.token) {
        setStatus({
          type: "error",
          message: response.data.message || "Invalid email or password",
        });
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", email.trim().toLowerCase());
      localStorage.setItem("userName", response.data.fullName || "");
      localStorage.setItem("userRole", response.data.role || "USER");
      
      // Dispatch event to notify Navbar of auth change
      window.dispatchEvent(new Event("authChanged"));
      
      setStatus({ type: "success", message: "Login successful. Redirecting to home..." });

      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Login failed. Please check backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <span>TravelGo Bus</span>
        <h1>Welcome back to smarter bus booking</h1>
        <p>Login to view saved bookings, faster checkout, live seats, and AbhiBus-style route offers.</p>
      </section>

      <section className="auth-card">
        <p className="auth-kicker">Login</p>
        <h2>Continue your journey</h2>
        <p className="auth-copy">Use your registered email and password to access your account.</p>

        <form onSubmit={handleLogin} className="auth-form">
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
              placeholder="Enter password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          New to TravelGo? <Link to="/register">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
