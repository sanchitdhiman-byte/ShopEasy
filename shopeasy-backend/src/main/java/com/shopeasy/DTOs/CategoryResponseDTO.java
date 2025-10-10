package com.shopeasy.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponseDTO {
    
    private String categoryId;
    private String categoryName;
    private String description;
    private String parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}
