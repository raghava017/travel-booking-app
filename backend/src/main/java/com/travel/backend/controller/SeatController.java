package com.travel.backend.controller;

import com.travel.backend.dto.SeatDetailsDTO;
import com.travel.backend.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin("*")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/available/{scheduleId}")
    public List<SeatDetailsDTO> getAvailableSeats(@PathVariable Long scheduleId) {
        return seatService.getAvailableSeats(scheduleId);
    }

    @GetMapping("/{scheduleId}")
    public List<SeatDetailsDTO> getAllSeats(@PathVariable Long scheduleId) {
        return seatService.getAllSeats(scheduleId);
    }

    @PostMapping("/{scheduleId}/book")
    public String bookSeats(@PathVariable Long scheduleId, @RequestBody List<String> seatNumbers) {
        seatService.bookSeats(scheduleId, seatNumbers);
        return "Seats booked successfully";
    }

    @PostMapping("/{scheduleId}/release")
    public String releaseSeats(@PathVariable Long scheduleId, @RequestBody List<String> seatNumbers) {
        seatService.releaseSeats(scheduleId, seatNumbers);
        return "Seats released successfully";
    }

    @PostMapping("/{scheduleId}/reserve")
    public SeatDetailsDTO reserveSeat(@PathVariable Long scheduleId, @RequestParam String seatNumber) {
        return seatService.reserveSeat(scheduleId, seatNumber);
    }
}
