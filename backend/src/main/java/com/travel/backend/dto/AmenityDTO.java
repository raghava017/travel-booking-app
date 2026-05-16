package com.travel.backend.dto;

public class AmenityDTO {
    private Long id;
    private String amenityName;
    private String description;
    private String iconUrl;

    public AmenityDTO(Long id, String amenityName, String description, String iconUrl) {
        this.id = id;
        this.amenityName = amenityName;
        this.description = description;
        this.iconUrl = iconUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAmenityName() {
        return amenityName;
    }

    public void setAmenityName(String amenityName) {
        this.amenityName = amenityName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
