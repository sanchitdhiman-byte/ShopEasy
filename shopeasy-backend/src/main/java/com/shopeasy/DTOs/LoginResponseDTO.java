package com.shopeasy.DTOs;

import com.shopeasy.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String userId;
    private String name;
    private String email;
    private Role role;
    private String token;
}
