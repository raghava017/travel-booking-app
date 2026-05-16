package com.travel.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bus_services")
public class BusService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "contact")
    private String contact;

    @Column(name = "rating")
    private Double rating = 4.5;

    public BusService() {}

    public BusService(String name) { this.name = name; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
}
