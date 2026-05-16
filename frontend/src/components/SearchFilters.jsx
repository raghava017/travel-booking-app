import { useState } from "react";
import "../styles/SearchFilters.css";

function SearchFilters({ onFilterChange, isLoading }) {
  const [filters, setFilters] = useState({
    busTypes: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "PRICE",
  });

  const handleBusTypeChange = (type) => {
    setFilters((prev) => {
      const busTypes = prev.busTypes.includes(type)
        ? prev.busTypes.filter((t) => t !== type)
        : [...prev.busTypes, type];
      
      const updatedFilters = { ...prev, busTypes };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSortChange = (e) => {
    const updatedFilters = { ...filters, sortBy: e.target.value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      busTypes: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "PRICE",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="search-filters">
      <div className="filter-section">
        <h3>Filter & Sort</h3>

        {/* Bus Type Filter */}
        <div className="filter-group">
          <label className="filter-title">Bus Type</label>
          <div className="checkbox-group">
            {["AC", "NON-AC", "SLEEPER", "SEMI-SLEEPER"].map((type) => (
              <label key={type} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.busTypes.includes(type)}
                  onChange={() => handleBusTypeChange(type)}
                  disabled={isLoading}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <label className="filter-title">Price Range (Rs)</label>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handlePriceChange}
              disabled={isLoading}
              className="price-input"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              disabled={isLoading}
              className="price-input"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label className="filter-title">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            disabled={isLoading}
            className="sort-select"
          >
            <option value="PRICE">Price: Low to High</option>
            <option value="RATING">Rating: High to Low</option>
            <option value="DEPARTURE_TIME">Departure Time</option>
            <option value="DURATION">Duration: Short to Long</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          className="reset-button"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default SearchFilters;
