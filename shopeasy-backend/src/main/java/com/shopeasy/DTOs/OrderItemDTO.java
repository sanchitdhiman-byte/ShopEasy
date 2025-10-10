package com.shopeasy.DTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    
    private String productId;
    private String productName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    
}
