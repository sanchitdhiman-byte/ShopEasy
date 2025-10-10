package com.shopeasy.service;

import com.shopeasy.DTOs.CategoryResponseDTO;
import com.shopeasy.DTOs.CategoryRequestDTO;
import com.shopeasy.DTOs.ProductResponseDTO;
import com.shopeasy.models.Category;
import com.shopeasy.models.Product;
import com.shopeasy.repositories.CategoryRepository;
import com.shopeasy.repositories.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    public CategoryResponseDTO createCategory(CategoryRequestDTO dto) {
        if (categoryRepository.existsByCategoryName(dto.getCategoryName())) {
            throw new IllegalArgumentException("Category already exists");
        }
        
        Category parent = null;
        if (dto.getParentId() != null) {
            parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found"));
        }
        
        Category category = Category.builder()
                .categoryName(dto.getCategoryName())
                .description(dto.getDescription())
                .parentCategory(parent)
                .createdAt(LocalDateTime.now())
                .build();
        
        category = categoryRepository.save(category);
        
        return mapToDTO(category);
    }
    
    public CategoryResponseDTO updateCategory(String categoryId, CategoryRequestDTO dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found"));
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }
        
        category.setUpdatedAt(LocalDateTime.now());
        
        Category updated = categoryRepository.save(category);
        
        return mapToDTO(updated);
    }
    
    public void deleteCategory(String categoryId) {
        if (categoryId == null || categoryId.isBlank()) {
            throw new IllegalArgumentException("Category name cannot be null or blank");
        }
        
        Category category = categoryRepository.findByCategoryId(categoryId);
        
        if (category == null) {
            throw new EntityNotFoundException("Invalid ID!");
        }
        
        categoryRepository.delete(category);
    }
    
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    
    public CategoryResponseDTO getCategoryById(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        return mapToDTO(category);
    }
    
    public List<ProductResponseDTO> getProductsByCategory(String categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        List<Product> products;
        
        if (!category.getSubCategories().isEmpty()) {
            List<Category> subCategories = new ArrayList<>();
            collectCategories(category, subCategories);
            subCategories.add(category);
            
            products = productRepository.findAll()
                    .stream()
                    .filter(p -> subCategories.contains(p.getCategory()))
                    .toList();
        } else {
            products = productRepository.findByCategory(category);
        }
        
        return products.stream().map(p -> ProductResponseDTO.builder()
                        .productId(p.getProductId())
                        .productName(p.getProductName())
                        .description(p.getDescription())
                        .price(p.getPrice())
                        .stockQuantity(p.getStockQuantity())
                        .categoryName(p.getCategory().getCategoryName())
                        .build())
                .toList();
    }
    
    public List<CategoryResponseDTO> getChildCategories(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        List<Category> subCategories = new ArrayList<>();
        collectCategories(category, subCategories);
        
        return subCategories.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    private void collectCategories(Category category, List<Category> subCategories) {
        if (!category.getSubCategories().isEmpty()) {
            for (Category subCategory : category.getSubCategories()) {
                subCategories.add(subCategory);
                collectCategories(subCategory, subCategories);
            }
        }
    }
    
    private CategoryResponseDTO mapToDTO(Category category) {
        return CategoryResponseDTO.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .parentId(category.getParentCategory() != null ? category.getParentCategory().getCategoryId() : null)
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}