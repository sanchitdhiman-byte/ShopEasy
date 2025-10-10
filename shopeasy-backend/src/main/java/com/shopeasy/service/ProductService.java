package com.shopeasy.service;

import com.shopeasy.DTOs.ProductRequestDTO;
import com.shopeasy.DTOs.ProductResponseDTO;
import com.shopeasy.enums.Role;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.*;
import com.shopeasy.repositories.CategoryRepository;
import com.shopeasy.repositories.ProductRepository;
import com.shopeasy.repositories.SellerRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::mapToDTO).toList();
    }
    
    public ProductResponseDTO getProductById(String id) {
        return productRepository.findById(id).map(this::mapToDTO).orElseThrow(() -> new DataNotFoundException("Product not found"));
    }
    
    
    public void deleteProduct(String productId) {
        Product product =productRepository.findById(productId).orElseThrow(() -> new DataNotFoundException("Product not found"));
        productRepository.delete(product);
    }
    
    public ProductResponseDTO mapToDTO(Product product) {
        List<String> imageUrls = product.getImages()
                .stream()
                .map(ProductImage::getImageUrl)
                .toList();
        
        List<String> videoUrls = product.getVideos()
                .stream()
                .map(ProductVideo::getVideoUrl)
                .toList();
        
        return ProductResponseDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .categoryName(product.getCategory().getCategoryName())
                .sellerId(product.getSeller().getSellerId())
                
                .imageUrl(imageUrls.isEmpty() ? null : imageUrls.get(0))
                
                .imageUrls(imageUrls)
                .videoUrls(videoUrls)
                .build();
    }
    
}
