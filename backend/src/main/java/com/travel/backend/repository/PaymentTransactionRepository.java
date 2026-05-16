package com.travel.backend.repository;

import com.travel.backend.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByBookingId(Long bookingId);
    Optional<PaymentTransaction> findByTransactionId(String transactionId);
}
