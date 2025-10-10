package com.shopeasy.DTOs;

import com.shopeasy.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    
    private String userId;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private LocalDateTime createdAt;
    
}
