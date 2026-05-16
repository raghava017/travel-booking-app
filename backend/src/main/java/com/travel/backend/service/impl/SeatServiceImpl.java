package com.travel.backend.service.impl;

import com.travel.backend.dto.SeatDetailsDTO;
import com.travel.backend.entity.Seat;
import com.travel.backend.entity.Schedule;
import com.travel.backend.repository.SeatRepository;
import com.travel.backend.repository.ScheduleRepository;
import com.travel.backend.service.SeatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final ScheduleRepository scheduleRepository;

    public SeatServiceImpl(SeatRepository seatRepository, ScheduleRepository scheduleRepository) {
        this.seatRepository = seatRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public List<SeatDetailsDTO> getAvailableSeats(Long scheduleId) {
        List<Seat> availableSeats = seatRepository.findAvailableSeats(scheduleId);
        return availableSeats.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SeatDetailsDTO> getAllSeats(Long scheduleId) {
        List<Seat> seats = seatRepository.findByScheduleId(scheduleId);
        return seats.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void bookSeats(Long scheduleId, List<String> seatNumbers) {
        List<Seat> seats = seatRepository.findByScheduleId(scheduleId);
        seats.stream()
                .filter(seat -> seatNumbers.contains(seat.getSeatNumber()))
                .forEach(seat -> {
                    seat.setSeatStatus("BOOKED");
                    seatRepository.save(seat);
                });
    }

    @Override
    @Transactional
    public void releaseSeats(Long scheduleId, List<String> seatNumbers) {
        List<Seat> seats = seatRepository.findByScheduleId(scheduleId);
        seats.stream()
                .filter(seat -> seatNumbers.contains(seat.getSeatNumber()))
                .forEach(seat -> {
                    seat.setSeatStatus("AVAILABLE");
                    seatRepository.save(seat);
                });
    }

    @Override
    @Transactional
    public SeatDetailsDTO reserveSeat(Long scheduleId, String seatNumber) {
        List<Seat> seats = seatRepository.findByScheduleId(scheduleId);
        Seat seat = seats.stream()
                .filter(s -> s.getSeatNumber().equals(seatNumber) && s.getSeatStatus().equals("AVAILABLE"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Seat not available"));
        
        seat.setSeatStatus("RESERVED");
        seatRepository.save(seat);
        return convertToDTO(seat);
    }

    private SeatDetailsDTO convertToDTO(Seat seat) {
        return new SeatDetailsDTO(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getSeatStatus(),
                seat.getRowNumber(),
                seat.getColumnNumber(),
                100.0
        );
    }
}
