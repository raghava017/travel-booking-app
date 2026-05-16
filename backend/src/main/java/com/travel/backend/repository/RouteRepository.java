package com.travel.backend.repository;

import com.travel.backend.entity.Route;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository
        extends JpaRepository<Route, Long> {
}