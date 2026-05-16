package com.travel.backend.service;

import com.travel.backend.dto.SeatDetailsDTO;
import java.util.List;

public interface SeatService {
    List<SeatDetailsDTO> getAvailableSeats(Long scheduleId);
    List<SeatDetailsDTO> getAllSeats(Long scheduleId);
    void bookSeats(Long scheduleId, List<String> seatNumbers);
    void releaseSeats(Long scheduleId, List<String> seatNumbers);
    SeatDetailsDTO reserveSeat(Long scheduleId, String seatNumber);
}
