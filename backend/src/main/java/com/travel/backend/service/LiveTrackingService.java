package com.travel.backend.service;

import com.travel.backend.entity.LiveTracking;
import java.util.Optional;

public interface LiveTrackingService {
    LiveTracking updateTracking(Long scheduleId, Double latitude, Double longitude, Double speed, String status);
    Optional<LiveTracking> getLatestTracking(Long scheduleId);
}
