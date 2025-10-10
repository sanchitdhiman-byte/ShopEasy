package com.shopeasy.DTOs;

import com.shopeasy.enums.PaymentMethod;
import jdk.jfr.Name;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {
    
    private String addressId;
    private PaymentMethod paymentMethod;
    private String cartId;
    
}
