package com.travel.backend.service.impl;

import com.travel.backend.dto.ScheduleRequest;
import com.travel.backend.entity.Bus;
import com.travel.backend.entity.Route;
import com.travel.backend.entity.Schedule;

import com.travel.backend.repository.BusRepository;
import com.travel.backend.repository.RouteRepository;
import com.travel.backend.repository.ScheduleRepository;

import com.travel.backend.service.ScheduleService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduleServiceImpl
        implements ScheduleService {

    private final ScheduleRepository scheduleRepository;

    private final BusRepository busRepository;

    private final RouteRepository routeRepository;

    public ScheduleServiceImpl(
            ScheduleRepository scheduleRepository,
            BusRepository busRepository,
            RouteRepository routeRepository
    ) {

        this.scheduleRepository = scheduleRepository;
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    public Schedule createSchedule(
            ScheduleRequest request
    ) {

        Bus bus = busRepository.findById(
                request.getBusId())
                .orElseThrow(() ->
                        new RuntimeException("Bus Not Found"));

        Route route = routeRepository.findById(
                request.getRouteId())
                .orElseThrow(() ->
                        new RuntimeException("Route Not Found"));

        Schedule schedule = new Schedule();

        schedule.setBus(bus);

        schedule.setRoute(route);

        schedule.setDepartureTime(
                LocalDateTime.parse(
                        request.getDepartureTime()));

        schedule.setArrivalTime(
                LocalDateTime.parse(
                        request.getArrivalTime()));

        schedule.setFare(request.getFare());

        return scheduleRepository.save(schedule);
    }

    @Override
    public List<Schedule> getAllSchedules() {

        return scheduleRepository.findAll();
    }
}