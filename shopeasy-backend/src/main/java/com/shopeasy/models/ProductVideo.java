package com.shopeasy.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "product_videos",
        indexes = {
                @Index(name = "idx_product_video_product", columnList = "product_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ProductVideo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "video_id")
    private String videoId;
    
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "fk_video_product"))
    @ToString.Exclude
    private Product product;
    
    @Column(name = "video_url", nullable = false, length = 255)
    private String videoUrl;
}
