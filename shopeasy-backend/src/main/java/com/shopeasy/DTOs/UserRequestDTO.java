package com.shopeasy.DTOs;

import com.shopeasy.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
    
    @NotBlank(message = "Name cannot be blank.")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters.")
    private String name;
    
    @NotBlank(message = "Email cannot be blank.")
    @Email(message = "Invalid email format.")
    private String email;
    
    @NotBlank(message = "Password cannot be blank.")
    @Size(min = 6, message = "Password must be at least 6 characters.")
    private String password;
    
    private String phone;
    
    private Role role;
}
