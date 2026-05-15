package com.example.agrichain.controller;

import com.example.agrichain.dto.ProductDTO;
import com.example.agrichain.service.ProductService;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ✅ CREATE PRODUCT WITH IMAGE UPLOAD
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart("image") MultipartFile imageFile) throws IOException {

        // Create uploads directory if not exists
        String uploadDir = "uploads/";
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate unique file name
        String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);

        // Save file
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save file path in DTO
        productDTO.setImageUrl(uploadDir + fileName);

        ProductDTO created = productService.createProduct(productDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/public/available")
    public ResponseEntity<List<ProductDTO>> getAvailableProducts() {
        return ResponseEntity.ok(productService.getAvailableProducts());
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<List<ProductDTO>> getFarmerProducts() {
        return ResponseEntity.ok(productService.getFarmerProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()) {

            String uploadDir = "uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);

            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            productDTO.setImageUrl(uploadDir + fileName);
        }

        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);

        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
