package com.example.agrichain.service;

import com.example.agrichain.dto.ProductDTO;
import com.example.agrichain.exception.ResourceNotFoundException;
import com.example.agrichain.model.Product;
import com.example.agrichain.model.User;
import com.example.agrichain.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserService userService;
    private final BlockchainService blockchainService;

    // ✅ Manual constructor injection (No Lombok)
    public ProductService(ProductRepository productRepository,
            UserService userService,
            BlockchainService blockchainService) {
        this.productRepository = productRepository;
        this.userService = userService;
        this.blockchainService = blockchainService;
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {

        User farmer = userService.getCurrentUser();

        if (farmer.getRole() != User.UserRole.FARMER) {
            throw new RuntimeException("Only farmers can add products");
        }

        Product product = new Product();
        product.setFarmer(farmer);
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setCategory(productDTO.getCategory());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setUnit(productDTO.getUnit());
        product.setGrowingMethod(productDTO.getGrowingMethod());
        product.setHarvestDate(productDTO.getHarvestDate());
        product.setCertification(productDTO.getCertification());
        product.setImageUrl(productDTO.getImageUrl());

        // ✅ IMPORTANT FIX
        product.setIsVerified(true);

        Product savedProduct = productRepository.save(product);

        // Blockchain optional
        try {
            String txHash = blockchainService.registerProduct(savedProduct);
            savedProduct.setBlockchainHash(txHash);
            savedProduct = productRepository.save(savedProduct);
        } catch (Exception e) {
            System.out.println("Blockchain failed: " + e.getMessage());
        }

        return convertToDTO(savedProduct);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getAvailableProducts() {
        return productRepository.findAvailableProducts()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getFarmerProducts() {
        User farmer = userService.getCurrentUser();
        return productRepository.findByFarmer(farmer)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        return convertToDTO(product);
    }

    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User currentUser = userService.getCurrentUser();

        if (!product.getFarmer().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own products");
        }

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setCategory(productDTO.getCategory());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setUnit(productDTO.getUnit());
        product.setGrowingMethod(productDTO.getGrowingMethod());
        product.setHarvestDate(productDTO.getHarvestDate());
        product.setCertification(productDTO.getCertification());
        product.setImageUrl(productDTO.getImageUrl());

        Product updatedProduct = productRepository.save(product);

        return convertToDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User currentUser = userService.getCurrentUser();

        if (!product.getFarmer().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    // ✅ Convert Entity to DTO safely
    private ProductDTO convertToDTO(Product product) {

        ProductDTO dto = new ProductDTO();

        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setUnit(product.getUnit());
        dto.setGrowingMethod(product.getGrowingMethod());
        dto.setHarvestDate(product.getHarvestDate());
        dto.setCertification(product.getCertification());
        dto.setImageUrl(product.getImageUrl());
        dto.setBlockchainHash(product.getBlockchainHash());
        dto.setIsVerified(product.getIsVerified());

        if (product.getFarmer() != null) {
            dto.setFarmerId(product.getFarmer().getId());
            dto.setFarmerName(product.getFarmer().getFullName());
        }

        // Convert chemicals safely
        if (product.getChemicals() != null) {
            dto.setChemicals(
                    product.getChemicals().stream().map(chemical -> {
                        ProductDTO.ChemicalDTO chemicalDTO = new ProductDTO.ChemicalDTO();

                        chemicalDTO.setChemicalName(chemical.getChemicalName());
                        chemicalDTO.setQuantity(chemical.getQuantity());
                        chemicalDTO.setUnit(chemical.getUnit());
                        chemicalDTO.setIsHarmful(chemical.getIsHarmful());

                        if (chemical.getSafetyLevel() != null) {
                            chemicalDTO.setSafetyLevel(
                                    chemical.getSafetyLevel().name());
                        }

                        return chemicalDTO;

                    }).collect(Collectors.toList()));
        }

        // Convert nutrients safely
        if (product.getNutrients() != null) {
            dto.setNutrients(
                    product.getNutrients().stream().map(nutrient -> {
                        ProductDTO.NutrientDTO nutrientDTO = new ProductDTO.NutrientDTO();

                        nutrientDTO.setNutrientName(nutrient.getNutrientName());
                        nutrientDTO.setValue(nutrient.getValue());
                        nutrientDTO.setUnit(nutrient.getUnit());
                        nutrientDTO.setDailyValuePercentage(
                                nutrient.getDailyValuePercentage());

                        return nutrientDTO;

                    }).collect(Collectors.toList()));
        }

        return dto;
    }
}
