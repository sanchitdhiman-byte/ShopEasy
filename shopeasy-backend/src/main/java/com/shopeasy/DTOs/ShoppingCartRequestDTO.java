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
public class ShoppingCartRequestDTO {
    
    @NotBlank
    private String productId;
    
    @NotNull
    @Min(value = 0)
    private int quantity;
}
