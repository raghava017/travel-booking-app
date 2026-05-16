package com.travel.backend.service.impl;

import com.travel.backend.entity.LiveTracking;
import com.travel.backend.entity.Schedule;
import com.travel.backend.repository.LiveTrackingRepository;
import com.travel.backend.repository.ScheduleRepository;
import com.travel.backend.service.LiveTrackingService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LiveTrackingServiceImpl implements LiveTrackingService {

    private final LiveTrackingRepository liveTrackingRepository;
    private final ScheduleRepository scheduleRepository;

    public LiveTrackingServiceImpl(LiveTrackingRepository liveTrackingRepository, ScheduleRepository scheduleRepository) {
        this.liveTrackingRepository = liveTrackingRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public LiveTracking updateTracking(Long scheduleId, Double latitude, Double longitude, Double speed, String status) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        
        LiveTracking tracking = new LiveTracking(schedule, latitude, longitude, speed, status);
        return liveTrackingRepository.save(tracking);
    }

    @Override
    public Optional<LiveTracking> getLatestTracking(Long scheduleId) {
        return liveTrackingRepository.findTopByScheduleIdOrderByUpdatedAtDesc(scheduleId);
    }
}
