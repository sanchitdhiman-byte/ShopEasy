package com.shopeasy.controllers;

import com.shopeasy.DTOs.CategoryResponseDTO;
import com.shopeasy.DTOs.ProductResponseDTO;
import com.shopeasy.models.Category;
import com.shopeasy.models.Product;
import com.shopeasy.repositories.CategoryRepository;
import com.shopeasy.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    
    @GetMapping
    public Map<String, Object> search(@RequestParam String search) {
        List<Product> products = productRepository.findByProductNameContainingIgnoreCase(search);
        List<Category> categories = categoryRepository.findByCategoryNameContainingIgnoreCase(search);
        
        List<ProductResponseDTO> productDTOs = products.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
        
        List<CategoryResponseDTO> categoryDTOs = categories.stream()
                .map(category -> modelMapper.map(category, CategoryResponseDTO.class))
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("products", productDTOs);
        result.put("categories", categoryDTOs);
        
        return result;
    }
}