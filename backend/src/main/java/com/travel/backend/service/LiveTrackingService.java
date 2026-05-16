package com.travel.backend.service;

import com.travel.backend.dto.TrackingDetailsDTO;
import com.travel.backend.entity.LiveTracking;

import java.util.List;
import java.util.Optional;

public interface LiveTrackingService {
    LiveTracking updateTracking(Long scheduleId, Double latitude, Double longitude, Double speed, String status);
    Optional<LiveTracking> getLatestTracking(Long scheduleId);
    List<LiveTracking> getTrackingHistory(Long scheduleId);
    Optional<TrackingDetailsDTO> getTrackingDetails(Long scheduleId);
    List<TrackingDetailsDTO> getAllActiveTrackings();
}
