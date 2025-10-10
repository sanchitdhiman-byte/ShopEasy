package com.shopeasy.DTOs;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingCartResponseDTO {
    
    private String cartId;
    private String userId;
    private List<ShoppingCartItemResponseDTO> cartItems;
    private double cartTotal;
    
}
