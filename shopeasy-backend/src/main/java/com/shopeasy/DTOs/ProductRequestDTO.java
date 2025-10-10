package com.shopeasy.DTOs;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestDTO {
    
    @NotBlank
    private String name;
    
    private String description;
    
    @NotNull
    @Min(value = 0)
    private double price;
    
    @NotNull
    @Min(value = 0)
    private int stockQuantity;
    
    @NotNull
    private String categoryId;
    
}
