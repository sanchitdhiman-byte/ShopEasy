package com.shopeasy.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDTO {

    private String reviewId;
    private String productId;
    private String userId;
    private double rating;
    private String review;
    private LocalDateTime createdAt;
    
}
