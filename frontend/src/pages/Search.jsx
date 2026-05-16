import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import BusCard from "../components/BusCard";
import SearchFilters from "../components/SearchFilters";
import Loader from "../components/Loader";
import "../styles/Search.css";

const demoBuses = [
  {
    scheduleId: "demo-1",
    busId: 101,
    busName: "AbhiBus Swiftline",
    busNumber: "TS-09-AB-2048",
    busType: "AC SLEEPER",
    fare: 899,
    availableSeats: 18,
    totalSeats: 36,
    departureTime: "2026-05-17T22:15:00",
    arrivalTime: "2026-05-18T06:35:00",
    sourceCity: "Hyderabad",
    destinationCity: "Bangalore",
    rating: 4.6,
    reviewCount: 1284,
    amenities: ["WiFi", "Charging Point", "Blanket", "Live Tracking"],
    boardingPoints: ["Miyapur", "Ameerpet", "Lakdikapul"],
    droppingPoints: ["Hebbal", "Majestic", "Madiwala"],
    cancellation: "Free cancellation till 6 hours before departure",
  },
  {
    scheduleId: "demo-2",
    busId: 102,
    busName: "Orange Tours Platinum",
    busNumber: "AP-16-OT-7766",
    busType: "AC SLEEPER",
    fare: 1049,
    availableSeats: 9,
    totalSeats: 36,
    departureTime: "2026-05-17T21:00:00",
    arrivalTime: "2026-05-18T05:45:00",
    sourceCity: "Hyderabad",
    destinationCity: "Bangalore",
    rating: 4.4,
    reviewCount: 932,
    amenities: ["Water Bottle", "Charging Point", "Reading Light"],
    boardingPoints: ["Kukatpally", "SR Nagar", "Mehdipatnam"],
    droppingPoints: ["Yelahanka", "Anand Rao Circle", "Silk Board"],
    cancellation: "Partial refund as per operator policy",
  },
  {
    scheduleId: "demo-3",
    busId: 103,
    busName: "Kaveri Travels Smart",
    busNumber: "KA-05-KT-1188",
    busType: "SEMI-SLEEPER",
    fare: 649,
    availableSeats: 24,
    totalSeats: 42,
    departureTime: "2026-05-17T19:30:00",
    arrivalTime: "2026-05-18T04:50:00",
    sourceCity: "Hyderabad",
    destinationCity: "Bangalore",
    rating: 4.1,
    reviewCount: 618,
    amenities: ["AC", "Charging Point", "Emergency Exit"],
    boardingPoints: ["Uppal", "Secunderabad", "Paradise"],
    droppingPoints: ["Devanahalli", "Tin Factory", "BTM Layout"],
    cancellation: "Low cancellation charges",
  },
  {
    scheduleId: "demo-4",
    busId: 104,
    busName: "VRL Value Express",
    busNumber: "MH-12-VL-5102",
    busType: "NON-AC",
    fare: 399,
    availableSeats: 31,
    totalSeats: 45,
    departureTime: "2026-05-17T23:40:00",
    arrivalTime: "2026-05-18T09:15:00",
    sourceCity: "Mumbai",
    destinationCity: "Pune",
    rating: 3.9,
    reviewCount: 301,
    amenities: ["Water Bottle", "Luggage Space"],
    boardingPoints: ["Borivali", "Sion", "Vashi"],
    droppingPoints: ["Wakad", "Swargate"],
    cancellation: "Non-refundable after departure",
  },
];

const normalizeBus = (item, index) => ({
  scheduleId: item.scheduleId ?? `api-${index}`,
  busId: item.busId,
  busName: item.busName,
  busNumber: item.busNumber,
  busType: item.busType,
  fare: item.fare,
  availableSeats: item.availableSeats,
  totalSeats: item.totalSeats,
  departureTime: item.departureTime,
  arrivalTime: item.arrivalTime,
  sourceCity: item.sourceCity,
  destinationCity: item.destinationCity,
  rating: item.rating || 0,
  reviewCount: item.reviewCount || 0,
  amenities: item.amenities?.length ? item.amenities : ["AC", "Charging Point"],
  boardingPoints: item.boardingPoints || ["Main Bus Stand", "City Pickup"],
  droppingPoints: item.droppingPoints || ["Central Drop", "City Drop"],
  cancellation: item.cancellation || "Cancellation available as per operator policy",
});

function Search() {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const location = useLocation();
  const routeSearch = location.state || {};
  const [filters, setFilters] = useState({
    busTypes: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "PRICE",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
    // fetchBuses reads the route values captured for this search visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // applyFilters uses the latest buses and filters from this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buses, filters]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await api.post("/search", {
        sourceCity: routeSearch.sourceCity,
        destinationCity: routeSearch.destinationCity,
        sortBy: "PRICE",
      });
      const busesData = response.data.map(normalizeBus);
      const realisticData = busesData.length > 2 ? busesData : [...busesData, ...demoBuses];
      setBuses(realisticData);
      setFilteredBuses(realisticData);
      setUsingDemoData(busesData.length <= 2);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setBuses(demoBuses);
      setFilteredBuses(demoBuses);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...buses];

    if (filters.busTypes.length > 0) {
      result = result.filter((bus) =>
        filters.busTypes.some((type) => bus.busType.toUpperCase().includes(type))
      );
    }

    if (filters.minPrice) {
      result = result.filter((bus) => bus.fare >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((bus) => bus.fare <= parseFloat(filters.maxPrice));
    }

    if (filters.sortBy === "PRICE") {
      result.sort((a, b) => a.fare - b.fare);
    } else if (filters.sortBy === "RATING") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sortBy === "DEPARTURE_TIME") {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (filters.sortBy === "DURATION") {
      result.sort((a, b) => getDurationMinutes(a) - getDurationMinutes(b));
    }

    setFilteredBuses(result);
  };

  const handleSelectBus = (bus) => {
    navigate("/seat-selection", { state: { bus } });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getDurationMinutes = (bus) => {
    const departure = new Date(bus.departureTime);
    const arrival = new Date(bus.arrivalTime);
    return Number.isNaN(arrival - departure) ? 99999 : (arrival - departure) / 60000;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="search-page">
      <section className="search-summary">
        <div>
          <p className="summary-kicker">
            {routeSearch.sourceCity || "Hyderabad"} to {routeSearch.destinationCity || "Bangalore"}
          </p>
          <h1>Compare buses, seats, and fares</h1>
          <span>{routeSearch.journeyDate || "Tomorrow"} · 1 traveller · AC and non-AC operators</span>
        </div>
        <button onClick={() => navigate("/")}>Modify search</button>
      </section>
      <div className="search-container">
        <div className="filters-sidebar">
          <SearchFilters onFilterChange={handleFilterChange} isLoading={loading} />
        </div>

        <div className="buses-section">
          <div className="results-header">
            <div>
              <h2>Available buses</h2>
              <p className="results-count">
                {filteredBuses.length} bus{filteredBuses.length !== 1 ? "es" : ""} found
              </p>
            </div>
            {usingDemoData && (
              <span className="demo-badge">Showing enhanced demo listings</span>
            )}
          </div>

          {filteredBuses.length === 0 ? (
            <div className="no-results">
              <p>No buses found matching your criteria.</p>
              <button onClick={() => setFilters({ busTypes: [], minPrice: "", maxPrice: "", sortBy: "PRICE" })}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="buses-list">
              {filteredBuses.map((bus) => (
                <BusCard
                  key={bus.scheduleId}
                  bus={bus}
                  onSelectBus={handleSelectBus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
