package com.travel.backend.dto;

import java.util.List;

public class BusSearchResultDTO {
    private Long scheduleId;
    private Long busId;
    private String busName;
    private String busNumber;
    private String busType;
    private Double fare;
    private Integer availableSeats;
    private Integer totalSeats;
    private String departureTime;
    private String arrivalTime;
    private String sourceCity;
    private String destinationCity;
    private Double rating;
    private Long reviewCount;
    private List<String> amenities;

    public BusSearchResultDTO(Long scheduleId, Long busId, String busName, String busNumber, String busType,
                             Double fare, Integer availableSeats, Integer totalSeats, String departureTime,
                             String arrivalTime, String sourceCity, String destinationCity, Double rating, Long reviewCount) {
        this.scheduleId = scheduleId;
        this.busId = busId;
        this.busName = busName;
        this.busNumber = busNumber;
        this.busType = busType;
        this.fare = fare;
        this.availableSeats = availableSeats;
        this.totalSeats = totalSeats;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.sourceCity = sourceCity;
        this.destinationCity = destinationCity;
        this.rating = rating;
        this.reviewCount = reviewCount;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getBusName() {
        return busName;
    }

    public void setBusName(String busName) {
        this.busName = busName;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getBusType() {
        return busType;
    }

    public void setBusType(String busType) {
        this.busType = busType;
    }

    public Double getFare() {
        return fare;
    }

    public void setFare(Double fare) {
        this.fare = fare;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getSourceCity() {
        return sourceCity;
    }

    public void setSourceCity(String sourceCity) {
        this.sourceCity = sourceCity;
    }

    public String getDestinationCity() {
        return destinationCity;
    }

    public void setDestinationCity(String destinationCity) {
        this.destinationCity = destinationCity;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }
}
