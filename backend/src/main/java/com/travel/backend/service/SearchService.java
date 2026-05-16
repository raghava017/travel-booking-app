package com.travel.backend.service;

import com.travel.backend.dto.BusSearchFilterDTO;
import com.travel.backend.dto.BusSearchResultDTO;
import java.util.List;

public interface SearchService {
    List<BusSearchResultDTO> searchBuses(BusSearchFilterDTO filterDTO);
    List<BusSearchResultDTO> searchBusesByRouteAndDate(String source, String destination, String date);
}
