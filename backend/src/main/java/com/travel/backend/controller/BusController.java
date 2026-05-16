package com.travel.backend.controller;

import com.travel.backend.entity.Bus;
import com.travel.backend.repository.BusRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusRepository busRepository;
    private final Logger logger = LoggerFactory.getLogger(BusController.class);

    public BusController(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @GetMapping
    public ResponseEntity<List<Bus>> listBuses(@RequestParam(required = false) Boolean acOnly) {
        logger.debug("Listing buses with acOnly={}", acOnly);
        List<Bus> all = busRepository.findAll();
        if (acOnly != null && acOnly) {
            List<Bus> filtered = all.stream().filter(b -> Boolean.TRUE.equals(b.getIsAc())).collect(Collectors.toList());
            return ResponseEntity.ok(filtered);
        }
        return ResponseEntity.ok(all);
    }
}
 