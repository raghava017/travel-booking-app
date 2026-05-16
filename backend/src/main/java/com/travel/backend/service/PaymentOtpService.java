package com.travel.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PaymentOtpService {

    private final Logger logger = LoggerFactory.getLogger(PaymentOtpService.class);

    private static class OtpEntry {
        String otp;
        Instant expiresAt;
    }

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String sendOtp(String contact) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        String token = UUID.randomUUID().toString();

        OtpEntry e = new OtpEntry();
        e.otp = otp;
        e.expiresAt = Instant.now().plusSeconds(5 * 60); // 5 minutes
        store.put(token, e);

        // In real system send via SMS/email gateway. Here we log for demo and testing.
        logger.info("Mock OTP sent to {}: {} (token={})", contact, otp, token);

        return token;
    }

    public boolean verifyOtp(String token, String otp) {
        if (token == null || otp == null) return false;
        OtpEntry e = store.get(token);
        if (e == null) return false;
        if (Instant.now().isAfter(e.expiresAt)) {
            store.remove(token);
            return false;
        }
        boolean ok = e.otp.equals(otp);
        if (ok) store.remove(token);
        return ok;
    }
}
