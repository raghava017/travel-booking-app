package com.travel.backend.controller;

import com.travel.backend.entity.City;
import com.travel.backend.repository.CityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityRepository cityRepository;
    private final Logger logger = LoggerFactory.getLogger(CityController.class);

    public CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public ResponseEntity<List<City>> list() {
        logger.debug("Listing all cities");
        return ResponseEntity.ok(cityRepository.findAll());
    }
}
