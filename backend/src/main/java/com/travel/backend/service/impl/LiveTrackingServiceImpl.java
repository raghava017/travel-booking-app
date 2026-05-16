package com.travel.backend.service.impl;

import com.travel.backend.dto.TrackingDetailsDTO;
import com.travel.backend.entity.LiveTracking;
import com.travel.backend.entity.Schedule;
import com.travel.backend.repository.LiveTrackingRepository;
import com.travel.backend.repository.ScheduleRepository;
import com.travel.backend.service.LiveTrackingService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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

    @Override
    public List<LiveTracking> getTrackingHistory(Long scheduleId) {
        return liveTrackingRepository.findByScheduleIdOrderByUpdatedAtDesc(scheduleId);
    }

    @Override
    public Optional<TrackingDetailsDTO> getTrackingDetails(Long scheduleId) {
        Optional<Schedule> scheduleOpt = scheduleRepository.findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            return Optional.empty();
        }

        Schedule schedule = scheduleOpt.get();
        Optional<LiveTracking> latestTracking = liveTrackingRepository.findTopByScheduleIdOrderByUpdatedAtDesc(scheduleId);

        TrackingDetailsDTO dto = buildTrackingDTO(schedule, latestTracking.orElse(null));
        return Optional.of(dto);
    }

    @Override
    public List<TrackingDetailsDTO> getAllActiveTrackings() {
        List<Schedule> schedules = scheduleRepository.findAll();
        List<TrackingDetailsDTO> result = new ArrayList<>();

        for (Schedule schedule : schedules) {
            Optional<LiveTracking> latestTracking = liveTrackingRepository.findTopByScheduleIdOrderByUpdatedAtDesc(schedule.getId());
            if (latestTracking.isPresent()) {
                result.add(buildTrackingDTO(schedule, latestTracking.get()));
            }
        }

        return result;
    }

    private TrackingDetailsDTO buildTrackingDTO(Schedule schedule, LiveTracking tracking) {
        TrackingDetailsDTO dto = new TrackingDetailsDTO();
        dto.setScheduleId(schedule.getId());

        if (schedule.getBus() != null) {
            dto.setBusName(schedule.getBus().getBusName());
            dto.setBusNumber(schedule.getBus().getBusNumber());
            dto.setBusType(schedule.getBus().getBusType());
        }

        if (schedule.getRoute() != null) {
            dto.setSourceCity(schedule.getRoute().getSourceCity());
            dto.setDestinationCity(schedule.getRoute().getDestinationCity());
            dto.setEstimatedDuration(schedule.getRoute().getEstimatedDuration());
            dto.setDistanceKm(schedule.getRoute().getDistanceKm());
        }

        dto.setDepartureTime(schedule.getDepartureTime());
        dto.setArrivalTime(schedule.getArrivalTime());
        dto.setFare(schedule.getFare());
        dto.setTrackingId("TRK-" + schedule.getId());

        if (tracking != null) {
            dto.setLatitude(tracking.getLatitude());
            dto.setLongitude(tracking.getLongitude());
            dto.setSpeed(tracking.getSpeed());
            dto.setStatus(tracking.getStatus());
            dto.setLastUpdated(tracking.getUpdatedAt());
        } else {
            dto.setStatus("SCHEDULED");
        }

        return dto;
    }
}
