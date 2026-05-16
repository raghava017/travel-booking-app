package com.travel.backend.controller;

import com.travel.backend.dto.AmenityDTO;
import com.travel.backend.service.AmenityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@CrossOrigin("*")
public class AmenityController {

    private final AmenityService amenityService;

    public AmenityController(AmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @PostMapping
    public AmenityDTO createAmenity(@RequestBody AmenityDTO amenityDTO) {
        return amenityService.createAmenity(amenityDTO);
    }

    @GetMapping
    public List<AmenityDTO> getAllAmenities() {
        return amenityService.getAllAmenities();
    }

    @GetMapping("/{id}")
    public AmenityDTO getAmenityById(@PathVariable Long id) {
        return amenityService.getAmenityById(id);
    }

    @PutMapping("/{id}")
    public AmenityDTO updateAmenity(@PathVariable Long id, @RequestBody AmenityDTO amenityDTO) {
        return amenityService.updateAmenity(id, amenityDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
        return "Amenity deleted successfully";
    }
}
