package com.shopeasy.service;

import com.shopeasy.DTOs.LoginDTO;
import com.shopeasy.DTOs.LoginResponseDTO;
import com.shopeasy.DTOs.UserRegistrationDTO;
import com.shopeasy.enums.Role;
import com.shopeasy.exceptions.AdminRegistrationNotAllowedException;
import com.shopeasy.exceptions.UserAlreadyExistsException;
import com.shopeasy.models.BlacklistedToken;
import com.shopeasy.models.Seller;
import com.shopeasy.models.ShoppingCart;
import com.shopeasy.models.User;
import com.shopeasy.repositories.BlacklistedTokenRepository;
import com.shopeasy.repositories.SellerRepository;
import com.shopeasy.repositories.ShoppingCartRepository;
import com.shopeasy.repositories.UserRepository;
import com.shopeasy.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public LoginResponseDTO register(UserRegistrationDTO dto) {
        if (dto.getRole() == Role.ADMIN) {
            throw new AdminRegistrationNotAllowedException("Cannot register as ADMIN");
        }
        
        Optional<User> existingEmailAndRole = userRepository.findByEmailAndRole(dto.getEmail(), dto.getRole());
        if (existingEmailAndRole.isPresent()) {
            throw new UserAlreadyExistsException("These credentials already exist.");
        }
        
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        
        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .password(hashedPassword)
                .role(dto.getRole() != null ? dto.getRole() : Role.BUYER)
                .build();
        
        userRepository.save(user);
        
        ShoppingCart shoppingCart = ShoppingCart.builder()
                .user(user)
                .cartItems(new ArrayList<>())
                .build();
        shoppingCartRepository.save(shoppingCart);
        
        if (dto.getRole() == Role.SELLER) {
            Seller seller = Seller.builder()
                    .user(user)
                    .shopName(dto.getName() + "'s Shop")
                    .shopDescription("Welcome to " + dto.getName() + "'s shop!")
                    .rating(0)
                    .totalProducts(0)
                    .totalSales(0)
                    .createdAt(LocalDateTime.now())
                    .build();
            sellerRepository.save(seller);
        }
        
        return LoginResponseDTO.builder()
                .userId(user.getUserId())
                .name(dto.getName())
                .email(dto.getEmail())
                .role(dto.getRole())
                .token(jwtUtil.generateToken(dto.getEmail(), dto.getRole().name()))
                .build();
    }
    
    public LoginResponseDTO login(LoginDTO dto) {
        User user = userRepository.findByEmailAndRole(dto.getEmail(), dto.getRole())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
        
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return LoginResponseDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }
    
    public void logout(String token) {
        BlacklistedToken blacklistedToken = BlacklistedToken.builder()
                .token(token)
                .blacklistedAt(LocalDateTime.now())
                .build();
        blacklistedTokenRepository.save(blacklistedToken);
    }
    
}
