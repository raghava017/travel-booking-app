package com.travel.backend.repository;

import com.travel.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBusId(Long busId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.bus.id = ?1")
    Double getAverageRating(Long busId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.bus.id = ?1")
    Long getReviewCount(Long busId);
}
