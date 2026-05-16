package com.travel.backend.service;

import com.travel.backend.dto.BusRequest;
import com.travel.backend.entity.Bus;

import java.util.List;

public interface BusService {

    Bus createBus(BusRequest request);

    List<Bus> getAllBuses();

    Bus getBusById(Long id);

    Bus updateBus(Long id, BusRequest request);

    void deleteBus(Long id);
}