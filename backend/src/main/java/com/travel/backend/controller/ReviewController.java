package com.travel.backend.controller;

import com.travel.backend.dto.ReviewDTO;
import com.travel.backend.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ReviewDTO createReview(
            @RequestParam Long busId,
            @RequestParam Long userId,
            @RequestParam Integer rating,
            @RequestParam String comment) {
        return reviewService.createReview(busId, userId, rating, comment);
    }

    @GetMapping("/bus/{busId}")
    public List<ReviewDTO> getReviewsByBusId(@PathVariable Long busId) {
        return reviewService.getReviewsByBusId(busId);
    }

    @GetMapping("/bus/{busId}/rating")
    public Double getAverageRating(@PathVariable Long busId) {
        return reviewService.getAverageRating(busId);
    }

    @GetMapping("/bus/{busId}/count")
    public Long getReviewCount(@PathVariable Long busId) {
        return reviewService.getReviewCount(busId);
    }
}
