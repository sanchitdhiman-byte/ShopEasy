package com.shopeasy.DTOs;

import com.shopeasy.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationDTO {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email
    @NotBlank
    private String email;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid Phone Number")
    @NotBlank
    private String phone;
    
    @Size(min = 8)
    @NotBlank
    private String password;
    
    @NotNull
    private Role role;
    
}
