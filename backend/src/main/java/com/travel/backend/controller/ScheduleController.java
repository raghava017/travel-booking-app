package com.travel.backend.controller;

import com.travel.backend.dto.ScheduleRequest;
import com.travel.backend.entity.Schedule;
import com.travel.backend.service.ScheduleService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin("*")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(
            ScheduleService scheduleService
    ) {

        this.scheduleService = scheduleService;
    }

    @PostMapping
    public Schedule createSchedule(
            @RequestBody ScheduleRequest request
    ) {

        return scheduleService.createSchedule(request);
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {

        return scheduleService.getAllSchedules();
    }
}