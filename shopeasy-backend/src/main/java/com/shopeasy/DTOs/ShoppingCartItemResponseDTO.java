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
public class ShoppingCartItemResponseDTO {
    
    private String cartItemId;
    
    private String productId;
    
    private String productName;
    
    @NotNull
    @Min(value = 1)
    private long quantity;
    
    @Min(value = 0)
    private double price;
    
    @Min(value = 0)
    private double totalPrice;
    
    private String imageUrl;
    
}
