package com.example.agrichain.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 20)
    private String unit;

    @Column(name = "growing_method", columnDefinition = "TEXT")
    private String growingMethod;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(length = 100)
    private String certification;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "blockchain_hash", length = 66)
    private String blockchainHash;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductChemical> chemicals = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductNutrient> nutrients = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ========================
    // Getters and Setters
    // ========================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getFarmer() { return farmer; }
    public void setFarmer(User farmer) { this.farmer = farmer; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getGrowingMethod() { return growingMethod; }
    public void setGrowingMethod(String growingMethod) { this.growingMethod = growingMethod; }

    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }

    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getBlockchainHash() { return blockchainHash; }
    public void setBlockchainHash(String blockchainHash) { this.blockchainHash = blockchainHash; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean verified) { isVerified = verified; }

    public List<ProductChemical> getChemicals() { return chemicals; }
    public void setChemicals(List<ProductChemical> chemicals) { this.chemicals = chemicals; }

    public List<ProductNutrient> getNutrients() { return nutrients; }
    public void setNutrients(List<ProductNutrient> nutrients) { this.nutrients = nutrients; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ========================
    // Helper Methods
    // ========================

    public void addChemical(ProductChemical chemical) {
        this.chemicals.add(chemical);
        chemical.setProduct(this);
    }

    public void addNutrient(ProductNutrient nutrient) {
        this.nutrients.add(nutrient);
        nutrient.setProduct(this);
    }
}
