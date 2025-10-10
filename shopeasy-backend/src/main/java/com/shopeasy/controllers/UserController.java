package com.shopeasy.controllers;

import com.shopeasy.DTOs.ReviewResponseDTO;
import com.shopeasy.DTOs.UserRequestDTO;
import com.shopeasy.DTOs.UserResponseDTO;
import com.shopeasy.enums.Role;
import com.shopeasy.security.JwtUtil;
import com.shopeasy.service.ReviewService;
import com.shopeasy.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/")
@RequiredArgsConstructor
public class UserController {
    
    public final UserService userService;
    private final ReviewService reviewService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getOwnProfile(@RequestHeader("Authorization") String header) {
        String userId = jwtUtil.extractClaim(header.substring(7), Claims::getSubject);
        
        return ResponseEntity.ok(userService.getOwnProfile(userId));
    }
    
    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(@Valid @RequestBody UserRequestDTO dto, Authentication authentication) {
        String email = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        return ResponseEntity.ok(userService.updateProfile(email, Role.valueOf(role), dto));
    }
    
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserByID(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserByID(userId));
    }
    
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@RequestParam(name = "role", required = false) Role role) {
        if (role == null) {
            return ResponseEntity.ok(userService.getAllUsers());
        }
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }
    
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<>("Account deleted successfully", HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/{userId}/reviews/")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUYER')")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }
    
}
