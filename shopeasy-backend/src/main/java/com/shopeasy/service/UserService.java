package com.shopeasy.service;

import com.shopeasy.DTOs.UserRequestDTO;
import com.shopeasy.DTOs.UserResponseDTO;
import com.shopeasy.enums.Role;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.User;
import com.shopeasy.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    
    public UserResponseDTO getOwnProfile(String userId) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        
        return UserResponseDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    public UserResponseDTO updateProfile(String email, Role role, UserRequestDTO dto) {
        User user = userRepository.findByEmailAndRole(email, role)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        
        if (dto.getName() != null && !dto.getName().isEmpty()) {
            user.setName(dto.getName());
        }
        
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        
        User updated = userRepository.save(user);
        return modelMapper.map(updated, UserResponseDTO.class);
    }
    
    public UserResponseDTO getUserByID(String userId) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        
        return modelMapper.map(user, UserResponseDTO.class);
    }
    
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        if (users.isEmpty()) {
            throw new IllegalStateException("No users found.");
        }
        
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }
    
    public List<UserResponseDTO> getUsersByRole(Role role) {
        if (role == null) {
            throw new IllegalArgumentException("Invalid Role.");
        }
        
        List<User> users = userRepository.findByRole(role);
        
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }
    
    public void deleteUser(String userId) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found."));
        
        userRepository.delete(user);
    }
}
