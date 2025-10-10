package com.shopeasy.impl;

import com.shopeasy.enums.Role;
import com.shopeasy.repositories.UserRepository;
import lombok.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    public UserDetails loadUserByEmailAndRole(String email, Role role) {
        com.shopeasy.models.User user = userRepository.findByEmailAndRole(email, role)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        
        return new User(
                user.getUserId(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) {
        throw new UnsupportedOperationException("Unsupported operation");
    }
}
