package com.shopeasy.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "addresses",
        indexes = {
                @Index(name = "idx_address_user_id", columnList = "user_id"),
                @Index(name = "idx_address_phone", columnList = "phone"),
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "address_id")
    private String addressId;
    
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_address_user"))
    private User user;
    
    @NotBlank
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;
    
    @Column(nullable = false, length = 15)
    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid Phone Number")
    private String phone;
    
    @NotBlank
    @Column(name = "line1", nullable = false, length = 255)
    private String line1;
    
    @Column(name = "line2", length = 255)
    private String line2;
    
    @NotBlank
    @Column(nullable = false, length = 100)
    private String city;
    
    @NotBlank
    @Column(nullable = false, length = 100)
    private String state;
    
    @NotBlank
    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;
    
    @NotBlank
    @Column(nullable = false, length = 100)
    private String country;
    
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
}
