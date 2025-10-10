package com.shopeasy.service;

import com.shopeasy.DTOs.ReviewRequestDTO;
import com.shopeasy.DTOs.ReviewResponseDTO;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.Product;
import com.shopeasy.models.Review;
import com.shopeasy.models.User;
import com.shopeasy.repositories.ProductRepository;
import com.shopeasy.repositories.ReviewRepository;
import com.shopeasy.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    public ReviewResponseDTO addReview(String productId, @Valid ReviewRequestDTO dto, String userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found."));
        
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new DataNotFoundException("User not found."));
        
        reviewRepository.findByProductAndUser(product, user).ifPresent(r -> {
            throw new IllegalStateException("You have already reviewed this product. Update it instead.");
        });
        
        Review review = Review.builder()
                .rating(dto.getRating())
                .comment(dto.getReview())
                .product(product)
                .user(user)
                .build();
        
        review = reviewRepository.save(review);
        return mapToDTO(review);
    }
    
    public List<ReviewResponseDTO> getAllReviews(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found."));
        
        return reviewRepository.findByProduct(product)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    
    public ReviewResponseDTO updateReview(String reviewId, @Valid ReviewRequestDTO dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new DataNotFoundException("Review not found."));
        
        review.setRating(dto.getRating());
        review.setComment(dto.getReview());
        
        Review updated = reviewRepository.save(review);
        return mapToDTO(updated);
    }
    
    public void deleteReview(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new DataNotFoundException("Review not found."));
        
        reviewRepository.delete(review);
    }
    
    public List<ReviewResponseDTO> getReviewsByUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        
        return reviewRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    
    private ReviewResponseDTO mapToDTO(Review review) {
        return ReviewResponseDTO.builder()
                .reviewId(review.getReviewId())
                .rating(review.getRating())
                .review(review.getComment())
                .productId(review.getProduct().getProductId())
                .userId(review.getUser().getUserId())
                .build();
    }
}
