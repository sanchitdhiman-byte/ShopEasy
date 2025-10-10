package com.shopeasy.security;

import com.shopeasy.enums.Role;
import com.shopeasy.models.BlacklistedToken;
import com.shopeasy.models.User;
import com.shopeasy.repositories.BlacklistedTokenRepository;
import com.shopeasy.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtUtil {

    @Autowired
    private UserRepository userRepository;
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private BlacklistedToken blacklistedToken;
    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;
    
    public String generateToken(String email, String role) {
        User user = userRepository.findByEmailAndRole(email,Role.valueOf(role)).orElseThrow(() -> new RuntimeException("User not found"));
        return Jwts.builder()
                .setSubject(String.valueOf(user.getUserId()))
                .claim("email", email)
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + 604800000))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .signWith(key)
                .compact();
    }
    public String getEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }
    
    public String getRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
        if (blacklistedTokenRepository.existsByToken(token)) {
            return false;
        }
        
        final String email = getEmail(token);
        final String role = getRole(token);
        
        User user = userRepository.findById(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isEmailMatch = email.equals(user.getEmail());
        
        boolean isRoleMatch = userDetails.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals(role));
        
        return isEmailMatch && isRoleMatch && !isTokenExpired(token);
    }
    
    public boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }
    
    public Date getExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token).getBody();
    }
    
}
