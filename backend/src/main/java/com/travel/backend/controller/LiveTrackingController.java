package com.travel.backend.controller;

import com.travel.backend.entity.LiveTracking;
import com.travel.backend.service.LiveTrackingService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin("*")
public class LiveTrackingController {

    private final LiveTrackingService liveTrackingService;

    public LiveTrackingController(LiveTrackingService liveTrackingService) {
        this.liveTrackingService = liveTrackingService;
    }

    @PostMapping("/{scheduleId}")
    public LiveTracking updateTracking(
            @PathVariable Long scheduleId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Double speed,
            @RequestParam String status) {
        return liveTrackingService.updateTracking(scheduleId, latitude, longitude, speed, status);
    }

    @GetMapping("/{scheduleId}")
    public Optional<LiveTracking> getLatestTracking(@PathVariable Long scheduleId) {
        return liveTrackingService.getLatestTracking(scheduleId);
    }
}
