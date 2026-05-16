package com.travel.backend.service.impl;

import com.travel.backend.dto.BusSearchFilterDTO;
import com.travel.backend.dto.BusSearchResultDTO;
import com.travel.backend.entity.Schedule;
import com.travel.backend.repository.ScheduleRepository;
import com.travel.backend.repository.ReviewRepository;
import com.travel.backend.repository.SeatRepository;
import com.travel.backend.service.SearchService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    private final ScheduleRepository scheduleRepository;
    private final ReviewRepository reviewRepository;
    private final SeatRepository seatRepository;

    public SearchServiceImpl(ScheduleRepository scheduleRepository, ReviewRepository reviewRepository, SeatRepository seatRepository) {
        this.scheduleRepository = scheduleRepository;
        this.reviewRepository = reviewRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    public List<BusSearchResultDTO> searchBuses(BusSearchFilterDTO filterDTO) {
        List<Schedule> schedules = scheduleRepository.findAll();
        
        return schedules.stream()
                .filter(s -> matchesFilter(s, filterDTO))
                .map(this::convertToDTO)
                .sorted((a, b) -> {
                    if ("PRICE".equals(filterDTO.getSortBy())) {
                        return a.getFare().compareTo(b.getFare());
                    } else if ("RATING".equals(filterDTO.getSortBy())) {
                        return Double.compare(b.getRating() != null ? b.getRating() : 0, a.getRating() != null ? a.getRating() : 0);
                    }
                    return 0;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<BusSearchResultDTO> searchBusesByRouteAndDate(String source, String destination, String date) {
        List<Schedule> schedules = scheduleRepository.findAll();
        
        return schedules.stream()
                .filter(s -> s.getRoute().getSourceCity().equalsIgnoreCase(source) &&
                           s.getRoute().getDestinationCity().equalsIgnoreCase(destination))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private boolean matchesFilter(Schedule schedule, BusSearchFilterDTO filter) {
        if (filter.getSourceCity() != null && !schedule.getRoute().getSourceCity().equalsIgnoreCase(filter.getSourceCity())) {
            return false;
        }
        if (filter.getDestinationCity() != null && !schedule.getRoute().getDestinationCity().equalsIgnoreCase(filter.getDestinationCity())) {
            return false;
        }
        if (filter.getBusTypes() != null && !filter.getBusTypes().contains(schedule.getBus().getBusType())) {
            return false;
        }
        if (filter.getMinPrice() != null && schedule.getFare() < filter.getMinPrice()) {
            return false;
        }
        if (filter.getMaxPrice() != null && schedule.getFare() > filter.getMaxPrice()) {
            return false;
        }
        return true;
    }

    private BusSearchResultDTO convertToDTO(Schedule schedule) {
        int availableCount = seatRepository.findByScheduleIdAndSeatStatus(schedule.getId(), "AVAILABLE").size();
        Double avgRating = reviewRepository.getAverageRating(schedule.getBus().getId());
        Long reviewCount = reviewRepository.getReviewCount(schedule.getBus().getId());
        
        return new BusSearchResultDTO(
                schedule.getId(),
                schedule.getBus().getId(),
                schedule.getBus().getBusName(),
                schedule.getBus().getBusNumber(),
                schedule.getBus().getBusType(),
                schedule.getFare(),
                availableCount,
                schedule.getBus().getTotalSeats(),
                schedule.getDepartureTime().toString(),
                schedule.getArrivalTime().toString(),
                schedule.getRoute().getSourceCity(),
                schedule.getRoute().getDestinationCity(),
                avgRating != null ? avgRating : 0.0,
                reviewCount != null ? reviewCount : 0L
        );
    }
}
