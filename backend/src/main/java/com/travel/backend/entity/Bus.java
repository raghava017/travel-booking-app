package com.travel.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_name")
    private String busName;

    @Column(name = "bus_number")
    private String busNumber;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "bus_type")
    private String busType;

    @Column(name = "is_ac")
    private Boolean isAc = true;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private BusService busService;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public String getBusType() {
        return busType;
    }

    public void setBusType(String busType) {
        this.busType = busType;
    }

    public Boolean getIsAc() {
        return isAc;
    }

    public void setIsAc(Boolean isAc) {
        this.isAc = isAc;
    }

    public BusService getBusService() {
        return busService;
    }

    public void setBusService(BusService busService) {
        this.busService = busService;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}