import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail"));
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole"));
  const [, setUpdateTrigger] = useState(0);

  useEffect(() => {
    // Update state immediately from localStorage
    setToken(localStorage.getItem("token"));
    setUserEmail(localStorage.getItem("userEmail"));
    setUserRole(localStorage.getItem("userRole"));

    // Listen for storage changes (logout from other tabs or login/logout events)
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUserEmail(localStorage.getItem("userEmail"));
      setUserRole(localStorage.getItem("userRole"));
    };

    // Custom event listener for login/logout within same tab
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
      setUserEmail(localStorage.getItem("userEmail"));
      setUserRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChanged", handleAuthChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setToken(null);
    setUserEmail(null);
    setUserRole(null);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("authChanged"));
    
    alert("Logged Out");
    window.location.href = "/login";
  };

  return (
    <nav className="app-navbar">
      <div className="nav-container">
        <Link className="nav-brand" to="/">
          <span>TravelGo</span>
          <small>Bus</small>
        </Link>

        <div className="nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/search">
            Search
          </Link>

          <Link to="/bookings">
            Bookings
          </Link>

          <Link to="/tracking">
            Tracking
          </Link>

          {userRole === "ADMIN" && (
            <Link to="/admin">
              Admin
            </Link>
          )}

          {
            token ? (
              <>
                <span className="nav-user">
                  {userEmail}
                </span>

                <button
                  className="nav-action"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>
            ) : (
              <>
                <Link to="/login">
                  Login
                </Link>

                <Link className="nav-action-link" to="/register">
                  Register
                </Link>
              </>
            )
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
