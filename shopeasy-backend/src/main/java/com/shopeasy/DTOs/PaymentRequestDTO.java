package com.shopeasy.DTOs;

import com.shopeasy.enums.PaymentMethod;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestDTO {
    
    private String orderId;
    private double amount;
    private PaymentMethod paymentMethod;
    
}
