package com.travel.backend.controller;

import com.travel.backend.dto.TrackingDetailsDTO;
import com.travel.backend.entity.LiveTracking;
import com.travel.backend.repository.LiveTrackingRepository;
import com.travel.backend.service.LiveTrackingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin("*")
public class TrackingController {

    private final LiveTrackingRepository liveTrackingRepository;
    private final LiveTrackingService liveTrackingService;
    private final Logger logger = LoggerFactory.getLogger(TrackingController.class);

    public TrackingController(LiveTrackingRepository liveTrackingRepository, LiveTrackingService liveTrackingService) {
        this.liveTrackingRepository = liveTrackingRepository;
        this.liveTrackingService = liveTrackingService;
    }

    @GetMapping("/schedule/{scheduleId}/latest")
    public ResponseEntity<?> getLatest(@PathVariable Long scheduleId) {
        return liveTrackingRepository.findTopByScheduleIdOrderByUpdatedAtDesc(scheduleId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/schedule/{scheduleId}")
    public List<LiveTracking> getAllForSchedule(@PathVariable Long scheduleId) {
        logger.debug("Fetching all tracking points for schedule={}", scheduleId);
        return liveTrackingService.getTrackingHistory(scheduleId);
    }

    @GetMapping("/schedule/{scheduleId}/details")
    public ResponseEntity<?> getTrackingDetails(@PathVariable Long scheduleId) {
        return liveTrackingService.getTrackingDetails(scheduleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public List<TrackingDetailsDTO> getAllActiveTrackings() {
        return liveTrackingService.getAllActiveTrackings();
    }

    @PostMapping
    public ResponseEntity<?> pushTracking(@RequestBody LiveTracking payload) {
        if (payload.getUpdatedAt() == null) payload.setUpdatedAt(LocalDateTime.now());
        LiveTracking saved = liveTrackingRepository.save(payload);
        logger.info("Tracking update saved: scheduleId={} lat={} lon={} speed={}",
                payload.getSchedule() != null ? payload.getSchedule().getId() : null,
                payload.getLatitude(), payload.getLongitude(), payload.getSpeed());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/by-tracking-id/{trackingId}")
    public ResponseEntity<?> getByTrackingId(@PathVariable String trackingId) {
        try {
            if (trackingId == null || !trackingId.startsWith("TRK-")) {
                return ResponseEntity.badRequest().body("Invalid trackingId format");
            }
            String[] parts = trackingId.split("-");
            if (parts.length < 2) return ResponseEntity.badRequest().body("Invalid trackingId format");
            Long scheduleId = Long.parseLong(parts[1]);
            return liveTrackingService.getTrackingDetails(scheduleId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("Invalid schedule id in trackingId");
        }
    }
}
