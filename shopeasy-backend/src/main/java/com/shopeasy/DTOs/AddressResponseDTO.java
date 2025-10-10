package com.shopeasy.DTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor@Builder
public class AddressResponseDTO {
    
    private String addressId;
    private String name;
    private String phone;
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    
}
