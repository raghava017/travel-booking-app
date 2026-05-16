package com.travel.backend.service;

import com.travel.backend.dto.ReviewDTO;
import java.util.List;

public interface ReviewService {
    ReviewDTO createReview(Long busId, Long userId, Integer rating, String comment);
    List<ReviewDTO> getReviewsByBusId(Long busId);
    Double getAverageRating(Long busId);
    Long getReviewCount(Long busId);
}
