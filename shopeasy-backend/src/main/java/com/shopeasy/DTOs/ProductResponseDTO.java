package com.shopeasy.DTOs;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    
    private String productId;
    private String productName;
    private String description;
    private double price;
    private int stockQuantity;
    private String categoryName;
    private String sellerId;
    
    private String imageUrl;
    
    private List<String> imageUrls;
    
    private List<String> videoUrls;
}
