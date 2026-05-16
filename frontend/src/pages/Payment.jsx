import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, selectedSeats, passengers } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [trackingIdState, setTrackingIdState] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [upiDetails, setUpiDetails] = useState({
    upiId: "",
  });


  // Validation helpers
  const validateCardNumber = (number) => {
    const digits = number.replace(/\D/g, "");
    return digits.length >= 13 && digits.length <= 19;
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateUPI = (upi) => {
    return /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+$/.test(upi);
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(" ");
  };

  if (!bus || !selectedSeats || !passengers) {
    return (
      <div className="payment-error-container">
        <p>Booking information not found. Please start over.</p>
        <button onClick={() => navigate("/search")}>Back to Search</button>
      </div>
    );
  }

  const totalAmount = Math.round(bus.fare * selectedSeats.length * 1.05);
  const selectedSeatNumbers = selectedSeats.map((seat) => seat.seatNumber || seat).join(", ");

  const saveBookingHistory = (transactionIdValue, status = "CONFIRMED") => {
    const history = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
    const primaryPassenger = passengers[0] || {};
    const bookingRecord = {
      id: transactionIdValue,
      transactionId: transactionIdValue,
      busName: bus.busName,
      busNumber: bus.busNumber,
      route: `${bus.sourceCity} to ${bus.destinationCity}`,
      sourceCity: bus.sourceCity,
      destinationCity: bus.destinationCity,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      seatNumbers: selectedSeatNumbers,
      seatsCount: selectedSeats.length,
      passengers,
      userName: primaryPassenger.name || localStorage.getItem("userName") || "Traveller",
      userEmail: primaryPassenger.email || localStorage.getItem("userEmail") || "",
      totalAmount,
      paymentMethod,
      bookingStatus: status,
      bookingTime: new Date().toISOString(),
    };

    localStorage.setItem("bookingHistory", JSON.stringify([bookingRecord, ...history]));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const formatted = formatCardNumber(value);
      setCardDetails({
        ...cardDetails,
        [name]: formatted,
      });
    } else if (name === "expiryMonth") {
      const val = value.replace(/\D/g, "").slice(0, 2);
      setCardDetails({ ...cardDetails, [name]: val });
    } else if (name === "expiryYear") {
      const val = value.replace(/\D/g, "").slice(0, 4);
      setCardDetails({ ...cardDetails, [name]: val });
    } else if (name === "cvv") {
      const val = value.replace(/\D/g, "").slice(0, 4);
      setCardDetails({ ...cardDetails, [name]: val });
    } else {
      setCardDetails({
        ...cardDetails,
        [name]: value,
      });
    }
    setErrorMessage("");
  };

  const handleUPIInputChange = (e) => {
    const { name, value } = e.target;
    setUpiDetails({
      ...upiDetails,
      [name]: value,
    });
    setErrorMessage("");
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      if (!cardDetails.cardNumber.replace(/\s/g, "").trim()) {
        setErrorMessage("Card number is required");
        return false;
      }
      if (!validateCardNumber(cardDetails.cardNumber)) {
        setErrorMessage("Invalid card number");
        return false;
      }
      if (!cardDetails.cardholderName.trim()) {
        setErrorMessage("Cardholder name is required");
        return false;
      }
      if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
        setErrorMessage("Expiry date is required");
        return false;
      }
      const month = parseInt(cardDetails.expiryMonth);
      const year = parseInt(cardDetails.expiryYear);
      if (month < 1 || month > 12) {
        setErrorMessage("Invalid expiry month");
        return false;
      }
      const currentYear = new Date().getFullYear();
      if (year < currentYear || (year === currentYear && month < new Date().getMonth() + 1)) {
        setErrorMessage("Card has expired");
        return false;
      }
      if (!cardDetails.cvv || !validateCVV(cardDetails.cvv)) {
        setErrorMessage("Invalid CVV");
        return false;
      }
    } else if (paymentMethod === "upi") {
      if (!upiDetails.upiId.trim()) {
        setErrorMessage("UPI ID is required");
        return false;
      }
      if (!validateUPI(upiDetails.upiId)) {
        setErrorMessage("Invalid UPI ID format");
        return false;
      }
    } else if (paymentMethod === "wallet") {
      if (Math.random() > 0.7) {
        setErrorMessage("Insufficient wallet balance");
        return false;
      }
    }

    return true;
  };

  // OTP removed: payments are processed directly without OTP verification

  const handlePayment = async () => {
    setErrorMessage("");

    // Validate payment details
    if (!validatePaymentDetails()) {
      return;
    }

    // No OTP flow — proceed to process payment

    setLoading(true);

    try {
      if (String(bus.scheduleId).startsWith("demo-")) {
        const demoTransactionId = `DEMO-${Date.now().toString().slice(-8)}`;
        saveBookingHistory(demoTransactionId);
        setTransactionId(demoTransactionId);
        setPaymentStatus("success");
        return;
      }

      // Prepare payment payload
      const paymentPayload = {
        busId: bus.busId,
        scheduleId: bus.scheduleId,
        selectedSeats: selectedSeats.map((seat) => seat.seatNumber || seat),
        passengers: passengers,
        paymentMethod: paymentMethod,
        amount: totalAmount,
        cardDetails:
          paymentMethod === "credit_card" || paymentMethod === "debit_card"
            ? {
                cardNumber: cardDetails.cardNumber.slice(-4),
                cardholderName: cardDetails.cardholderName,
              }
            : null,
        upiId: paymentMethod === "upi" ? upiDetails.upiId : null,
      };

      await processPaymentToServer(paymentPayload);
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error.response?.data?.message || "Payment processing failed");
      setPaymentStatus("failure");
    } finally {
      setLoading(false);
    }
  };

  const processPaymentToServer = async (overridePayload) => {
    try {
      const paymentPayload = overridePayload || {
        busId: bus.busId,
        scheduleId: bus.scheduleId,
        selectedSeats: selectedSeats.map((seat) => seat.seatNumber || seat),
        passengers: passengers,
        paymentMethod: paymentMethod,
        amount: totalAmount,
        cardDetails:
          paymentMethod === "credit_card" || paymentMethod === "debit_card"
            ? {
                cardNumber: cardDetails.cardNumber.slice(-4),
                cardholderName: cardDetails.cardholderName,
              }
            : null,
        upiId: paymentMethod === "upi" ? upiDetails.upiId : null,
      };

      const response = await api.post("/payments/process", paymentPayload);

      if (response.data.success) {
        saveBookingHistory(response.data.transactionId);
        setTransactionId(response.data.transactionId);
        if (response.data.trackingId) setTrackingIdState(response.data.trackingId);
        setPaymentStatus("success");
      } else {
        setErrorMessage(response.data.message || "Payment failed. Please try again.");
        setPaymentStatus("failure");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error.response?.data?.message || "Payment processing failed");
      setPaymentStatus("failure");
    }
  };

  const handleNewTransaction = () => {
    setPaymentStatus(null);
    setTransactionId("");
    setCardDetails({
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setUpiDetails({ upiId: "" });
    setTrackingIdState("");
    setErrorMessage("");
  };

  // Success Screen
  if (paymentStatus === "success") {
    return (
      <div className="payment-container">
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <div className="transaction-details">
            <p>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            {trackingIdState && (
              <p>
                <strong>Tracking ID:</strong> {trackingIdState}
              </p>
            )}
            <p>
              <strong>Amount Paid:</strong> ₹{totalAmount}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentMethod.replace(/_/g, " ").toUpperCase()}
            </p>
          </div>
          <div className="booking-summary">
            <h3>Booking Confirmation</h3>
            <p>
              <strong>Bus:</strong> {bus.busName}
            </p>
            <p>
              <strong>Route:</strong> {bus.sourceCity} → {bus.destinationCity}
            </p>
            <p>
              <strong>Seats:</strong> {selectedSeatNumbers}
            </p>
            <p>
              <strong>Passengers:</strong> {passengers.length}
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() => navigate("/bookings")}
          >
            View My Bookings
          </button>
          <button className="secondary-button" onClick={() => navigate("/search")}>
            Book Another Bus
          </button>
        </div>
      </div>
    );
  }

  // Failure Screen
  if (paymentStatus === "failure") {
    return (
      <div className="payment-container">
        <div className="payment-failure">
          <div className="failure-icon">✕</div>
          <h2>Payment Failed</h2>
          <p className="error-text">{errorMessage}</p>
          <div className="failure-actions">
            <button
              className="primary-button"
              onClick={handleNewTransaction}
            >
              Try Again
            </button>
            <button className="secondary-button" onClick={() => navigate("/search")}>
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form Screen
  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="payment-main">
          <h1>Payment Details</h1>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Bus:</span>
              <span>{bus.busName}</span>
            </div>
            <div className="summary-row">
              <span>Route:</span>
              <span>{bus.sourceCity} → {bus.destinationCity}</span>
            </div>
            <div className="summary-row">
              <span>Seats Selected:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="summary-row">
              <span>Passengers:</span>
              <span>
                {passengers.map((p) => p.name).join(", ")}
              </span>
            </div>
            <div className="summary-row">
              <span>Base Fare:</span>
              <span>₹{Math.round(bus.fare * selectedSeats.length)}</span>
            </div>
            <div className="summary-row">
              <span>Taxes & Fees:</span>
              <span>₹{Math.round(bus.fare * selectedSeats.length * 0.05)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="methods-grid">
              <label className={`method-option ${paymentMethod === "credit_card" ? "selected" : ""}`}>
                <input
                  type="radio"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setErrorMessage("");
                    setTrackingIdState("");
                  }}
                />
                <div className="method-content">
                  <span className="method-icon">💳</span>
                  <span>Credit Card</span>
                </div>
              </label>

              <label className={`method-option ${paymentMethod === "debit_card" ? "selected" : ""}`}>
                <input
                  type="radio"
                  value="debit_card"
                  checked={paymentMethod === "debit_card"}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setErrorMessage("");
                    setTrackingIdState("");
                  }}
                />
                <div className="method-content">
                  <span className="method-icon">🏦</span>
                  <span>Debit Card</span>
                </div>
              </label>

              <label className={`method-option ${paymentMethod === "upi" ? "selected" : ""}`}>
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setErrorMessage("");
                    setTrackingIdState("");
                  }}
                />
                <div className="method-content">
                  <span className="method-icon">📱</span>
                  <span>UPI</span>
                </div>
              </label>

              <label className={`method-option ${paymentMethod === "wallet" ? "selected" : ""}`}>
                <input
                  type="radio"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setErrorMessage("");
                    setTrackingIdState("");
                  }}
                />
                <div className="method-content">
                  <span className="method-icon">👛</span>
                  <span>Wallet</span>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Form */}
          {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
            <div className="payment-form">
              <h3>Card Details</h3>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  maxLength="19"
                />
              </div>

              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="John Doe"
                  value={cardDetails.cardholderName}
                  onChange={handleCardInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Month</label>
                  <input
                    type="text"
                    name="expiryMonth"
                    placeholder="MM"
                    value={cardDetails.expiryMonth}
                    onChange={handleCardInputChange}
                    maxLength="2"
                  />
                </div>

                <div className="form-group">
                  <label>Expiry Year</label>
                  <input
                    type="text"
                    name="expiryYear"
                    placeholder="YYYY"
                    value={cardDetails.expiryYear}
                    onChange={handleCardInputChange}
                    maxLength="4"
                  />
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    maxLength="4"
                  />
                </div>
              </div>

              {/* OTP removed: payments proceed without OTP */}
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="payment-form">
              <h3>UPI Details</h3>
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="yourname@bankname"
                  value={upiDetails.upiId}
                  onChange={handleUPIInputChange}
                />
              </div>
              <p className="info-text">Example: john.doe@okhdfcbank</p>
            </div>
          )}

          {paymentMethod === "wallet" && (
            <div className="wallet-info">
              <p>💳 You will be redirected to your wallet provider for payment confirmation</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Pay Now Button */}
          <button
            className={`pay-button ${loading ? "loading" : ""}`}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing Payment...
              </>
            ) : (
              `Pay ₹${totalAmount}`
            )}
          </button>

          <button
            className="cancel-button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel & Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
