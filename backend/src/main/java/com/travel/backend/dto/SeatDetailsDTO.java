package com.travel.backend.dto;

public class SeatDetailsDTO {
    private Long id;
    private String seatNumber;
    private String seatStatus;
    private Integer rowNumber;
    private Integer columnNumber;
    private Double price;

    public SeatDetailsDTO(Long id, String seatNumber, String seatStatus, Integer rowNumber, Integer columnNumber, Double price) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatStatus = seatStatus;
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getSeatStatus() {
        return seatStatus;
    }

    public void setSeatStatus(String seatStatus) {
        this.seatStatus = seatStatus;
    }

    public Integer getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(Integer rowNumber) {
        this.rowNumber = rowNumber;
    }

    public Integer getColumnNumber() {
        return columnNumber;
    }

    public void setColumnNumber(Integer columnNumber) {
        this.columnNumber = columnNumber;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
