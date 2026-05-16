package com.travel.backend.service;

import com.travel.backend.dto.AmenityDTO;
import java.util.List;

public interface AmenityService {
    AmenityDTO createAmenity(AmenityDTO amenityDTO);
    List<AmenityDTO> getAllAmenities();
    AmenityDTO getAmenityById(Long id);
    AmenityDTO updateAmenity(Long id, AmenityDTO amenityDTO);
    void deleteAmenity(Long id);
}
