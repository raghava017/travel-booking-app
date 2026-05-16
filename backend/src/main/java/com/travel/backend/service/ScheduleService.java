package com.travel.backend.service;

import com.travel.backend.dto.ScheduleRequest;
import com.travel.backend.entity.Schedule;

import java.util.List;

public interface ScheduleService {

    Schedule createSchedule(
            ScheduleRequest request
    );

    List<Schedule> getAllSchedules();
}