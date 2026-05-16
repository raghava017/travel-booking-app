package com.travel.backend.service;

import com.travel.backend.dto.RouteRequest;
import com.travel.backend.entity.Route;

import java.util.List;

public interface RouteService {

    Route createRoute(RouteRequest request);

    List<Route> getAllRoutes();
}