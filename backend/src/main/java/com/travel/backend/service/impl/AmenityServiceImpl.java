package com.travel.backend.service.impl;

import com.travel.backend.dto.AmenityDTO;
import com.travel.backend.entity.Amenity;
import com.travel.backend.repository.AmenityRepository;
import com.travel.backend.service.AmenityService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmenityServiceImpl implements AmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityServiceImpl(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    @Override
    public AmenityDTO createAmenity(AmenityDTO amenityDTO) {
        Amenity amenity = new Amenity(
                amenityDTO.getAmenityName(),
                amenityDTO.getDescription(),
                amenityDTO.getIconUrl()
        );
        Amenity saved = amenityRepository.save(amenity);
        return convertToDTO(saved);
    }

    @Override
    public List<AmenityDTO> getAllAmenities() {
        return amenityRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AmenityDTO getAmenityById(Long id) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Amenity not found"));
        return convertToDTO(amenity);
    }

    @Override
    public AmenityDTO updateAmenity(Long id, AmenityDTO amenityDTO) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Amenity not found"));
        
        amenity.setAmenityName(amenityDTO.getAmenityName());
        amenity.setDescription(amenityDTO.getDescription());
        amenity.setIconUrl(amenityDTO.getIconUrl());
        
        Amenity updated = amenityRepository.save(amenity);
        return convertToDTO(updated);
    }

    @Override
    public void deleteAmenity(Long id) {
        amenityRepository.deleteById(id);
    }

    private AmenityDTO convertToDTO(Amenity amenity) {
        return new AmenityDTO(
                amenity.getId(),
                amenity.getAmenityName(),
                amenity.getDescription(),
                amenity.getIconUrl()
        );
    }
}
