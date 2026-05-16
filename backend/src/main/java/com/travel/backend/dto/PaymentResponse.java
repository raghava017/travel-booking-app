package com.travel.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PaymentResponse {

    @JsonProperty("success")
    private Boolean success;

    @JsonProperty("transactionId")
    private String transactionId;

    @JsonProperty("message")
    private String message;

    @JsonProperty("paymentStatus")
    private String paymentStatus;

    @JsonProperty("amount")
    private Double amount;

    @JsonProperty("paymentMethod")
    private String paymentMethod;

    @JsonProperty("trackingId")
    private String trackingId;

    public PaymentResponse() {
    }

    public PaymentResponse(Boolean success, String transactionId, String message, String paymentStatus, Double amount, String paymentMethod) {
        this.success = success;
        this.transactionId = transactionId;
        this.message = message;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
