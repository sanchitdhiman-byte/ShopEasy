package com.shopeasy.service;

import com.shopeasy.DTOs.DashboardStatsDTO;
import com.shopeasy.DTOs.OrderResponseDTO;
import com.shopeasy.DTOs.ProductRequestDTO;
import com.shopeasy.DTOs.ProductResponseDTO;
import com.shopeasy.enums.OrderStatus;
import com.shopeasy.enums.Role;
import com.shopeasy.exceptions.DataNotFoundException;
import com.shopeasy.models.*;
import com.shopeasy.repositories.CategoryRepository;
import com.shopeasy.repositories.OrderRepository;
import com.shopeasy.repositories.ProductRepository;
import com.shopeasy.repositories.SellerRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SellerService {
    
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final FileStorageService fileStorageService;
    
    public List<ProductResponseDTO> getProductsBySellerId(String sellerId) {
        
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new DataNotFoundException("Seller not found."));
        
        List<Product> products = productRepository.findBySeller(seller);
        
        return products.stream()
                .map(this::mapToDTO)
                .toList();
    }
    
    private ProductResponseDTO mapToDTO(Product product) {
        return ProductResponseDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .categoryName(product.getCategory().getCategoryName())
                .sellerId(product.getSeller().getSellerId())
                .build();
    }
    
    
    public ProductResponseDTO addProduct(ProductRequestDTO dto, User user,
                                         List<MultipartFile> images, List<MultipartFile> videos) {
        
        if (user.getRole() != Role.SELLER)
            throw new SecurityException("Only a seller account can add products.");
        
        Seller seller = sellerRepository.findByUser(user)
                .orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new UsernameNotFoundException("Category not found"));
        
        if (productRepository.existsByProductNameAndSellerAndCategory(dto.getName(), seller, category))
            throw new IllegalArgumentException("A product with this name already exists for this seller in this category.");
        
        Product product = Product.builder()
                .productName(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .category(category)
                .seller(seller)
                .build();
        
        List<ProductImage> imageEntities = new ArrayList<>();
        List<ProductVideo> videoEntities = new ArrayList<>();
        
        for (MultipartFile image : images) {
            String imageUrl = fileStorageService.saveFile(image, "images");
            System.out.println(imageUrl);
            imageEntities.add(ProductImage.builder().product(product).imageUrl(imageUrl).build());
        }
        
        if (videos != null) {
            for (MultipartFile video : videos) {
                String videoUrl = fileStorageService.saveFile(video, "videos");
                videoEntities.add(ProductVideo.builder().product(product).videoUrl(videoUrl).build());
            }
        }
        
        product.setImages(imageEntities);
        product.setVideos(videoEntities);
        
        productRepository.save(product);
        
        return mapToDTO(product);
    }
    
    public ProductResponseDTO updateProduct(
            String productId,
            @Valid ProductRequestDTO dto,
            List<MultipartFile> newImages,
            List<MultipartFile> newVideos,
            List<String> removeImageIds,
            List<String> removeVideoIds,
            User user
    ) {
        
        if (user.getRole() != Role.SELLER) {
            throw new SecurityException("Only a seller account can update products.");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found"));
        
        product.setProductName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new DataNotFoundException("Category not found"));
            product.setCategory(category);
        }
        
        if (removeImageIds != null && !removeImageIds.isEmpty()) {
            product.getImages().removeIf(img -> removeImageIds.contains(img.getImageId()));
        }
        
        if (removeVideoIds != null && !removeVideoIds.isEmpty()) {
            product.getVideos().removeIf(vid -> removeVideoIds.contains(vid.getVideoId()));
        }
        
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile file : newImages) {
                String imageUrl = fileStorageService.saveFile(file, "images");
                product.getImages().add(ProductImage.builder()
                        .product(product)
                        .imageUrl(imageUrl)
                        .build());
            }
        }
        
        if (newVideos != null && !newVideos.isEmpty()) {
            for (MultipartFile file : newVideos) {
                String videoUrl = fileStorageService.saveFile(file, "videos");
                product.getVideos().add(ProductVideo.builder()
                        .product(product)
                        .videoUrl(videoUrl)
                        .build());
            }
        }
        
        Product updated = productRepository.save(product);
        return mapToDTO(updated);
    }
    
    public List<OrderResponseDTO> getOrdersBySellerId(User user) {
        Seller seller = sellerRepository.findByUser(user).orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
        
        return null;
    }
    
    public DashboardStatsDTO getDashboardStats(User user) {
        if (user.getRole() != Role.SELLER) {
            throw new SecurityException("Only a seller account can view the dashboard.");
        }
        
        Double total = orderRepository.sumTotalSales();
        double totalSales = total == null ? 0 : total;
        long totalOrders = orderRepository.count();
        long productsListed = productRepository.count();
        long pendingOrders = orderRepository.countByOrderStatus(OrderStatus.PENDING);
        
        return DashboardStatsDTO.builder()
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .productsListed(productsListed)
                .pendingOrders(pendingOrders)
                .build();
    }
}
