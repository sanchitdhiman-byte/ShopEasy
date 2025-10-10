package com.shopeasy.controllers;

import com.shopeasy.DTOs.ReviewRequestDTO;
import com.shopeasy.DTOs.ReviewResponseDTO;
import com.shopeasy.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PutMapping("/{reviewId}/")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<ReviewResponseDTO> updateReviewRating(@PathVariable String reviewId, @RequestBody ReviewRequestDTO dto) {
        return ResponseEntity.ok(reviewService.updateReview(reviewId, dto));
    }
    
    @DeleteMapping("/{reviewId}/")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUYER')")
    public ResponseEntity<String> deleteReview(@PathVariable String reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }

}
