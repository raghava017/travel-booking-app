package com.travel.backend.service;

import com.travel.backend.dto.BookingRequest;
import com.travel.backend.entity.Booking;

import java.util.List;

public interface BookingService {
    Booking createBooking(BookingRequest request);
    List<Booking> getAllBookings();
}

