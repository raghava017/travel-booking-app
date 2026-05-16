package com.travel.backend.dto;

public class ScheduleRequest {

    private Long busId;

    private Long routeId;

    private String departureTime;

    private String arrivalTime;

    private Double fare;

    // GETTERS & SETTERS

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(
            String departureTime
    ) {

        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(
            String arrivalTime
    ) {

        this.arrivalTime = arrivalTime;
    }

    public Double getFare() {
        return fare;
    }

    public void setFare(Double fare) {
        this.fare = fare;
    }
}