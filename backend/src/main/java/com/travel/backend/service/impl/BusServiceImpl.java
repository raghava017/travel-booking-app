package com.travel.backend.service.impl;

import com.travel.backend.dto.BusRequest;
import com.travel.backend.entity.Bus;
import com.travel.backend.repository.BusRepository;
import com.travel.backend.service.BusService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;

    public BusServiceImpl(
            BusRepository busRepository
    ) {

        this.busRepository = busRepository;
    }

    // CREATE BUS

    @Override
    public Bus createBus(
            BusRequest request
    ) {

        Bus bus = new Bus();

        bus.setBusName(request.getBusName());

        bus.setBusNumber(request.getBusNumber());

        bus.setTotalSeats(request.getTotalSeats());

        bus.setBusType(request.getBusType());

        bus.setCreatedAt(LocalDateTime.now());

        return busRepository.save(bus);
    }

    // GET ALL BUSES

    @Override
    public List<Bus> getAllBuses() {

        return busRepository.findAll();
    }

    // GET BUS BY ID

    @Override
    public Bus getBusById(Long id) {

        return busRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bus Not Found"));
    }

    // UPDATE BUS

    @Override
    public Bus updateBus(
            Long id,
            BusRequest request
    ) {

        Bus bus = busRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bus Not Found"));

        bus.setBusName(request.getBusName());

        bus.setBusNumber(request.getBusNumber());

        bus.setTotalSeats(request.getTotalSeats());

        bus.setBusType(request.getBusType());

        return busRepository.save(bus);
    }

    // DELETE BUS

    @Override
    public void deleteBus(Long id) {

        Bus bus = busRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bus Not Found"));

        busRepository.delete(bus);
    }
}