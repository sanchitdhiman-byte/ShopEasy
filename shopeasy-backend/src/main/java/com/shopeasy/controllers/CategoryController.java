package com.shopeasy.controllers;

import com.shopeasy.DTOs.CategoryResponseDTO;
import com.shopeasy.DTOs.CategoryRequestDTO;
import com.shopeasy.DTOs.ProductResponseDTO;
import com.shopeasy.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping("/")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    
    @GetMapping("/{categoryId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable String categoryId) {
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }
    
    @PostMapping("/")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SELLER')")
    public ResponseEntity<CategoryResponseDTO> createCategory(@Valid @RequestBody CategoryRequestDTO dto) {
        return new ResponseEntity<>(categoryService.createCategory(dto), HttpStatus.CREATED);
    }
    
    @PutMapping("/{categoryId}/")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable String categoryId, @Valid @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, dto));
    }
    
    @DeleteMapping("/{categoryId}/")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteCategory(@PathVariable String categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("Category deleted successfully");
    }
    
    @GetMapping("/{categoryId}/products/")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(categoryService.getProductsByCategory(categoryId));
    }
    
    @GetMapping("/{categoryId}/subcategories/")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CategoryResponseDTO>> getChildCategories(@PathVariable String categoryId) {
        return ResponseEntity.ok(categoryService.getChildCategories(categoryId));
    }
}