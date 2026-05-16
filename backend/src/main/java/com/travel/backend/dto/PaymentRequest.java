package com.travel.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PaymentRequest {

    @JsonProperty("busId")
    private Long busId;

    @JsonProperty("scheduleId")
    private Long scheduleId;

    @JsonProperty("selectedSeats")
    private List<String> selectedSeats;

    @JsonProperty("passengers")
    private List<PassengerInfo> passengers;

    @JsonProperty("paymentMethod")
    private String paymentMethod;

    @JsonProperty("amount")
    private Double amount;

    @JsonProperty("cardDetails")
    private CardDetails cardDetails;

    @JsonProperty("upiId")
    private String upiId;

    public PaymentRequest() {
    }

    public PaymentRequest(Long busId, Long scheduleId, List<String> selectedSeats, List<PassengerInfo> passengers, String paymentMethod, Double amount) {
        this.busId = busId;
        this.scheduleId = scheduleId;
        this.selectedSeats = selectedSeats;
        this.passengers = passengers;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public List<String> getSelectedSeats() {
        return selectedSeats;
    }

    public void setSelectedSeats(List<String> selectedSeats) {
        this.selectedSeats = selectedSeats;
    }

    public List<PassengerInfo> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerInfo> passengers) {
        this.passengers = passengers;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public CardDetails getCardDetails() {
        return cardDetails;
    }

    public void setCardDetails(CardDetails cardDetails) {
        this.cardDetails = cardDetails;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public static class CardDetails {
        @JsonProperty("cardNumber")
        private String cardNumber;

        @JsonProperty("cardholderName")
        private String cardholderName;

        public CardDetails() {
        }

        public CardDetails(String cardNumber, String cardholderName) {
            this.cardNumber = cardNumber;
            this.cardholderName = cardholderName;
        }

        public String getCardNumber() {
            return cardNumber;
        }

        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        public String getCardholderName() {
            return cardholderName;
        }

        public void setCardholderName(String cardholderName) {
            this.cardholderName = cardholderName;
        }
    }

    public static class PassengerInfo {
        @JsonProperty("name")
        private String name;

        @JsonProperty("age")
        private Integer age;

        @JsonProperty("gender")
        private String gender;

        @JsonProperty("email")
        private String email;

        @JsonProperty("phone")
        private String phone;

        public PassengerInfo() {
        }

        public PassengerInfo(String name, Integer age, String gender, String email, String phone) {
            this.name = name;
            this.age = age;
            this.gender = gender;
            this.email = email;
            this.phone = phone;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}
