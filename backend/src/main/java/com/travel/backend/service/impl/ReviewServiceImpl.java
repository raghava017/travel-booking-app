package com.travel.backend.service.impl;

import com.travel.backend.dto.ReviewDTO;
import com.travel.backend.entity.Bus;
import com.travel.backend.entity.Review;
import com.travel.backend.entity.User;
import com.travel.backend.repository.BusRepository;
import com.travel.backend.repository.ReviewRepository;
import com.travel.backend.repository.UserRepository;
import com.travel.backend.service.ReviewService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BusRepository busRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, BusRepository busRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.busRepository = busRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ReviewDTO createReview(Long busId, Long userId, Integer rating, String comment) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Review review = new Review(bus, user, rating, comment);
        Review saved = reviewRepository.save(review);
        return convertToDTO(saved);
    }

    @Override
    public List<ReviewDTO> getReviewsByBusId(Long busId) {
        return reviewRepository.findByBusId(busId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Double getAverageRating(Long busId) {
        return reviewRepository.getAverageRating(busId);
    }

    @Override
    public Long getReviewCount(Long busId) {
        return reviewRepository.getReviewCount(busId);
    }

    private ReviewDTO convertToDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getUser().getFullName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt().toString()
        );
    }
}
