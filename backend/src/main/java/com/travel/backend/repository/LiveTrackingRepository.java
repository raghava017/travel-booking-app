package com.travel.backend.repository;

import com.travel.backend.entity.LiveTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiveTrackingRepository extends JpaRepository<LiveTracking, Long> {

    Optional<LiveTracking> findTopByScheduleIdOrderByUpdatedAtDesc(Long scheduleId);

    List<LiveTracking> findByScheduleIdOrderByUpdatedAtDesc(Long scheduleId);
}
