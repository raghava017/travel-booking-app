import { useState } from "react";
import "../styles/PassengerForm.css";

function PassengerForm({ selectedSeats, onSubmit }) {
  const [passengers, setPassengers] = useState(
    selectedSeats.map((_, index) => ({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: selectedSeats[index].allowedGender || selectedSeats[index].travellerGender || "",
      allowedGender: selectedSeats[index].allowedGender || null,
      seatNumber: selectedSeats[index].seatNumber,
    }))
  );

  const [formValid, setFormValid] = useState(false);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
    validateForm(updatedPassengers);
  };

  const validateForm = (passengersData) => {
    const isValid = passengersData.every(
      (p) => p.name.trim() && p.email.trim() && p.phone.trim() && p.age && p.gender
    );
    setFormValid(isValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid) {
      onSubmit(passengers);
    }
  };

  return (
    <div className="passenger-form-container">
      <h2>Passenger Details</h2>
      <p className="form-subtitle">
        Enter details for {selectedSeats.length} passenger(s)
      </p>

      <form onSubmit={handleSubmit}>
        {passengers.map((passenger, index) => (
          <div key={index} className="passenger-card">
            <div className="passenger-header">
              <h3>Passenger {index + 1}</h3>
              <span className="seat-badge">{passenger.seatNumber}</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor={`name-${index}`}>Full Name *</label>
                <input
                  id={`name-${index}`}
                  type="text"
                  placeholder="Enter full name"
                  value={passenger.name}
                  onChange={(e) =>
                    handlePassengerChange(index, "name", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`email-${index}`}>Email *</label>
                <input
                  id={`email-${index}`}
                  type="email"
                  placeholder="Enter email address"
                  value={passenger.email}
                  onChange={(e) =>
                    handlePassengerChange(index, "email", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`phone-${index}`}>Phone Number *</label>
                <input
                  id={`phone-${index}`}
                  type="tel"
                  placeholder="10-digit phone number"
                  value={passenger.phone}
                  onChange={(e) =>
                    handlePassengerChange(index, "phone", e.target.value)
                  }
                  maxLength="10"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`age-${index}`}>Age *</label>
                <input
                  id={`age-${index}`}
                  type="number"
                  placeholder="Age"
                  value={passenger.age}
                  onChange={(e) =>
                    handlePassengerChange(index, "age", e.target.value)
                  }
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`gender-${index}`}>Gender *</label>
                <select
                  id={`gender-${index}`}
                  value={passenger.gender}
                  onChange={(e) =>
                    handlePassengerChange(index, "gender", e.target.value)
                  }
                  disabled={Boolean(passenger.allowedGender)}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="FEMALE">Ladies</option>
                  <option value="MALE">Gents</option>
                </select>
                {passenger.allowedGender && (
                  <small className="gender-lock-note">
                    This berth is available only for {passenger.allowedGender === "FEMALE" ? "Ladies" : "Gents"}.
                  </small>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="submit-button"
          disabled={!formValid}
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
}

export default PassengerForm;
