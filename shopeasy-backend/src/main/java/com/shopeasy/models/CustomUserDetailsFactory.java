package com.shopeasy.models;

public class CustomUserDetailsFactory {
    
    public static CustomUserDetails createSeller(User user) {
        return new CustomUserDetails(
                user.getUserId(),
                user.getEmail(),
                user.getPassword(),
                user.getRole()
        );
    }
}
