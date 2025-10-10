package com.shopeasy.DTOs;

import com.shopeasy.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginDTO {
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
    
    @NotNull
    private Role role;
}
