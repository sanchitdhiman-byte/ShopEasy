package com.shopeasy.DTOs;

import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequestDTO {
    
    private String name;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid Phone Number")
    private String phone;
    
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    
}
