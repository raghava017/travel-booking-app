package com.travel.backend.controller;

import com.travel.backend.dto.BookingRequest;
import com.travel.backend.dto.PaymentRequest;
import com.travel.backend.dto.PaymentResponse;
import com.travel.backend.entity.Booking;
import com.travel.backend.entity.PaymentTransaction;
import com.travel.backend.repository.PaymentTransactionRepository;
import com.travel.backend.service.BookingService;
import com.travel.backend.service.PaymentOtpService;
import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.StringJoiner;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {

    private final BookingService bookingService;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentOtpService paymentOtpService;

    public PaymentController(
            BookingService bookingService,
            PaymentTransactionRepository paymentTransactionRepository
            , PaymentOtpService paymentOtpService
    ) {
        this.bookingService = bookingService;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.paymentOtpService = paymentOtpService;
    }

    @PostMapping("/process")
    public PaymentResponse processPayment(@RequestBody PaymentRequest request) {
        try {
            validatePaymentRequest(request);

            BookingRequest bookingRequest = new BookingRequest();
            bookingRequest.setScheduleId(request.getScheduleId());
            bookingRequest.setSeatNumbers(String.join(",", request.getSelectedSeats()));
            bookingRequest.setTotalAmount(request.getAmount());

            PaymentRequest.PassengerInfo primaryPassenger = request.getPassengers().get(0);
            bookingRequest.setUserName(primaryPassenger.getName());
            bookingRequest.setUserEmail(primaryPassenger.getEmail());

            Booking booking = bookingService.createBooking(bookingRequest);
            String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            PaymentTransaction transaction = new PaymentTransaction(
                    booking,
                    transactionId,
                    request.getAmount(),
                    normalizePaymentMethod(request.getPaymentMethod()),
                    "SUCCESS"
            );
            paymentTransactionRepository.save(transaction);

                PaymentResponse resp = new PaymentResponse(
                    true,
                    transactionId,
                    "Payment successful",
                    "SUCCESS",
                    request.getAmount(),
                    request.getPaymentMethod()
                );
                if (booking != null) resp.setTrackingId(booking.getTrackingId());
                return resp;
        } catch (Exception ex) {
            return new PaymentResponse(
                    false,
                    null,
                    ex.getMessage(),
                    "FAILED",
                    request.getAmount(),
                    request.getPaymentMethod()
            );
        }
    }

    @PostMapping("/send-otp")
    public Map<String, Object> sendOtp(@RequestBody Map<String, String> body) {
        String contact = body.getOrDefault("contact", "unknown");
        String token = paymentOtpService.sendOtp(contact);
        return Map.of("otpToken", token, "message", "OTP sent (mock) to " + contact);
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> body) {
        String token = body.get("otpToken");
        String otp = body.get("otp");
        boolean ok = paymentOtpService.verifyOtp(token, otp);
        return Map.of("verified", ok);
    }

    private void validatePaymentRequest(PaymentRequest request) {
        StringJoiner errors = new StringJoiner(", ");

        if (request.getScheduleId() == null) {
            errors.add("Schedule is required");
        }
        if (request.getSelectedSeats() == null || request.getSelectedSeats().isEmpty()) {
            errors.add("At least one seat is required");
        }
        if (request.getPassengers() == null || request.getPassengers().isEmpty()) {
            errors.add("Passenger details are required");
        }
        if (request.getAmount() == null || request.getAmount() <= 0) {
            errors.add("Valid payment amount is required");
        }
        if (request.getPaymentMethod() == null || request.getPaymentMethod().isBlank()) {
            errors.add("Payment method is required");
        }

        if (errors.length() > 0) {
            throw new IllegalArgumentException(errors.toString());
        }
    }

    private String normalizePaymentMethod(String paymentMethod) {
        return paymentMethod == null ? "UNKNOWN" : paymentMethod.replace("_", " ").toUpperCase();
    }
}
