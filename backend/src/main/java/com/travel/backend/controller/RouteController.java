package com.travel.backend.controller;

import com.travel.backend.dto.RouteRequest;
import com.travel.backend.entity.Route;
import com.travel.backend.service.RouteService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin("*")
public class RouteController {

    private final RouteService routeService;

    public RouteController(
            RouteService routeService
    ) {

        this.routeService = routeService;
    }

    @PostMapping
    public Route createRoute(
            @RequestBody RouteRequest request
    ) {

        return routeService.createRoute(request);
    }

    @GetMapping
    public List<Route> getAllRoutes() {

        return routeService.getAllRoutes();
    }
}