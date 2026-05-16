package com.travel.backend.controller;

import com.travel.backend.dto.BookingRequest;
import com.travel.backend.entity.Booking;
import com.travel.backend.service.BookingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService
    ) {

        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(
            @RequestBody BookingRequest request
    ) {

        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }
}