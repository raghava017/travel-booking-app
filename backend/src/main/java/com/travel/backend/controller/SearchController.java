package com.travel.backend.controller;

import com.travel.backend.dto.BusSearchFilterDTO;
import com.travel.backend.dto.BusSearchResultDTO;
import com.travel.backend.service.SearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin("*")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @PostMapping
    public List<BusSearchResultDTO> searchBuses(@RequestBody BusSearchFilterDTO filterDTO) {
        return searchService.searchBuses(filterDTO);
    }

    @GetMapping
    public List<BusSearchResultDTO> searchByRouteAndDate(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date) {
        return searchService.searchBusesByRouteAndDate(source, destination, date);
    }
}
