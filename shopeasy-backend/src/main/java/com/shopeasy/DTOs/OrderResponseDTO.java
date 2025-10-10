package com.shopeasy.DTOs;

import com.shopeasy.enums.OrderStatus;
import com.shopeasy.enums.PaymentMethod;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    
    private String orderId;
    private double totalAmount;
    private OrderStatus orderStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PaymentMethod paymentMethod;
    private String addressId;
    private List<OrderItemDTO> orderItems;
    
}
