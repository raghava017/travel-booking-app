package com.travel.backend.repository;

import com.travel.backend.entity.Seat;
import com.travel.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByScheduleId(Long scheduleId);
    
    List<Seat> findByScheduleIdAndSeatStatus(Long scheduleId, String status);
    
    @Query("SELECT s FROM Seat s WHERE s.schedule.id = ?1 AND s.seatStatus = 'AVAILABLE' ORDER BY s.rowNumber, s.columnNumber")
    List<Seat> findAvailableSeats(Long scheduleId);
}
