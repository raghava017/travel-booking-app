import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const cities = ["Hyderabad", "Bangalore", "Chennai", "Coimbatore", "Mumbai", "Pune", "Delhi", "Jaipur"];
  const [fromCity, setFromCity] = useState("Hyderabad");
  const [toCity, setToCity] = useState("Bangalore");
  const [journeyDate, setJourneyDate] = useState(today);

  const popularRoutes = [
    { from: "Hyderabad", to: "Bangalore", price: "Rs 699", time: "9h 20m" },
    { from: "Chennai", to: "Coimbatore", price: "Rs 549", time: "8h 10m" },
    { from: "Mumbai", to: "Pune", price: "Rs 299", time: "3h 35m" },
    { from: "Delhi", to: "Jaipur", price: "Rs 399", time: "5h 15m" },
  ];

  const offers = [
    { title: "Flat 10% off", code: "FIRSTBUS", note: "New user offer up to Rs 150" },
    { title: "Weekend saver", code: "WEEKEND", note: "Extra cashback on night buses" },
    { title: "Zero booking fee", code: "NOFEE", note: "Selected AC sleeper services" },
  ];

  const handleSearch = () => {
    navigate("/search", {
      state: {
        sourceCity: fromCity,
        destinationCity: toCity,
        journeyDate,
      },
    });
  };

  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-shade">
          <div className="hero-content">
            <p className="hero-kicker">Bus tickets across India</p>
            <h1>Book buses with live seats, best fares, and instant confirmation</h1>
            <p className="hero-copy">
              Compare AC sleepers, semi-sleepers, boarding points, ratings, offers, and cancellation-friendly trips in one place.
            </p>

            <div className="search-panel" aria-label="Search buses">
              <label>
                <span>From</span>
                <select value={fromCity} onChange={(event) => setFromCity(event.target.value)}>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </label>
              <button className="swap-button" type="button" aria-label="Swap cities" onClick={handleSwap}>⇄</button>
              <label>
                <span>To</span>
                <select value={toCity} onChange={(event) => setToCity(event.target.value)}>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Journey date</span>
                <input type="date" value={journeyDate} onChange={(event) => setJourneyDate(event.target.value)} />
              </label>
              <button className="search-button" onClick={handleSearch}>
                Search buses
              </button>
            </div>

            <div className="hero-stats" aria-label="TravelGo highlights">
              <span><strong>3,200+</strong> routes</span>
              <span><strong>4.6/5</strong> traveller rating</span>
              <span><strong>24x7</strong> trip support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="offers-section">
        <div className="section-heading">
          <h2>Trending offers</h2>
          <p>Apply coupons at checkout and save on popular operators.</p>
        </div>
        <div className="offer-grid">
          {offers.map((offer) => (
            <article className="offer-card" key={offer.code}>
              <p>{offer.title}</p>
              <strong>{offer.code}</strong>
              <span>{offer.note}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="routes-section">
        <div className="section-heading">
          <h2>Popular bus routes</h2>
          <p>Fast-selling corridors with frequent departures every day.</p>
        </div>
        <div className="route-grid">
          {popularRoutes.map((route) => (
            <button className="route-card" key={`${route.from}-${route.to}`} onClick={() => navigate("/search")}>
              <span>{route.from} to {route.to}</span>
              <strong>From {route.price}</strong>
              <small>{route.time} average journey</small>
            </button>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <div>
          <h2>Everything travellers expect before booking</h2>
          <p>See real-time seat availability, boarding windows, fare breakup, amenities, cancellation notes, and verified operator ratings before choosing a bus.</p>
        </div>
        <div className="trust-grid">
          <div>
            <strong>Live seats</strong>
            <span>Know exactly how many seats are left.</span>
          </div>
          <div>
            <strong>Clean fare breakup</strong>
            <span>Base fare, taxes, and savings shown clearly.</span>
          </div>
          <div>
            <strong>Operator badges</strong>
            <span>Pick top-rated and punctual buses faster.</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
