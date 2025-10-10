package com.shopeasy.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "sellers",
        indexes = {
                @Index(name = "idx_seller_user_id", columnList = "user_id"),
                @Index(name = "idx_seller_rating", columnList = "rating"),
                @Index(name = "idx_seller_shop_name", columnList = "shop_name")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seller {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "seller_id")
    private String sellerId;
    
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_seller_user")
    )
    private User user;
    
    @Column(name = "shop_name", nullable = false, length = 150)
    private String shopName;
    
    @Column(name = "shop_description", columnDefinition = "TEXT")
    private String shopDescription;
    
    @Column(nullable = false)
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    private double rating = 0.0;
    
    @Column(name = "total_products", nullable = false)
    @Min(value = 0)
    private Integer totalProducts = 0;
    
    @Column(name = "total_sales", nullable = false)
    @Min(value = 0)
    private Integer totalSales = 0;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
}
