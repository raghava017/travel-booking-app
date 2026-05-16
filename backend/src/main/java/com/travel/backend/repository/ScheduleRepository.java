package com.travel.backend.repository;

import com.travel.backend.entity.Schedule;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository
        extends JpaRepository<Schedule, Long> {
}