package com.travel.backend.service.impl;

import com.travel.backend.dto.BookingRequest;
import com.travel.backend.entity.Booking;
import com.travel.backend.entity.Schedule;

import com.travel.backend.repository.BookingRepository;
import com.travel.backend.repository.ScheduleRepository;

import com.travel.backend.service.BookingService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
public class BookingServiceImpl
        implements BookingService {

    private final BookingRepository bookingRepository;

    private final ScheduleRepository scheduleRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            ScheduleRepository scheduleRepository
    ) {

        this.bookingRepository = bookingRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public Booking createBooking(
            BookingRequest request
    ) {

        Schedule schedule = scheduleRepository
                .findById(request.getScheduleId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Schedule Not Found"));

        // EXISTING BOOKINGS

        List<Booking> existingBookings =
                bookingRepository.findByScheduleId(
                        request.getScheduleId());

        String requestedSeats =
                request.getSeatNumbers();

        // CHECK SEAT ALREADY BOOKED

        for (Booking existingBooking
                : existingBookings) {

            String bookedSeats =
                    existingBooking.getSeatNumbers();

            for (String seat
                    : requestedSeats.split(",")) {

                if (bookedSeats.contains(
                        seat.trim())) {

                    throw new RuntimeException(
                            "Seat Already Booked: "
                                    + seat);
                }
            }
        }

        // CREATE BOOKING

        Booking booking = new Booking();

        booking.setUserName(request.getUserName());
        booking.setUserEmail(request.getUserEmail());
        booking.setSeatNumbers(request.getSeatNumbers());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setBookingStatus("CONFIRMED");
        booking.setBookingTime(LocalDateTime.now());
        booking.setSchedule(schedule);

        // Generate a realistic tracking ID linked to the schedule so passengers can track the bus.
        // Format: TRK-<scheduleId>-<8char>
        String trackingId = "TRK-" + schedule.getId() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        booking.setTrackingId(trackingId);

        Booking saved = bookingRepository.save(booking);

        return saved;
    }

    @Override
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }
}