package com.travel.backend.service.impl;

import com.travel.backend.dto.RouteRequest;
import com.travel.backend.entity.Route;
import com.travel.backend.repository.RouteRepository;
import com.travel.backend.service.RouteService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteServiceImpl
        implements RouteService {

    private final RouteRepository routeRepository;

    public RouteServiceImpl(
            RouteRepository routeRepository
    ) {

        this.routeRepository = routeRepository;
    }

    @Override
    public Route createRoute(
            RouteRequest request
    ) {

        Route route = new Route();

        route.setSourceCity(
                request.getSourceCity());

        route.setDestinationCity(
                request.getDestinationCity());

        route.setDistanceKm(
                request.getDistanceKm());

        route.setEstimatedDuration(
                request.getEstimatedDuration());

        return routeRepository.save(route);
    }

    @Override
    public List<Route> getAllRoutes() {

        return routeRepository.findAll();
    }
}