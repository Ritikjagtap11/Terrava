package com.example.agrichain.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_chemicals")
public class ProductChemical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "chemical_name", nullable = false, length = 100)
    private String chemicalName;

    @Column(precision = 10, scale = 3)
    private BigDecimal quantity;

    @Column(length = 20)
    private String unit;

    @Column(name = "is_harmful")
    private Boolean isHarmful = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "safety_level")
    private SafetyLevel safetyLevel;

    // ======================
    // Constructors
    // ======================

    public ProductChemical() {
    }

    public ProductChemical(Long id, Product product, String chemicalName,
                           BigDecimal quantity, String unit,
                           Boolean isHarmful, SafetyLevel safetyLevel) {
        this.id = id;
        this.product = product;
        this.chemicalName = chemicalName;
        this.quantity = quantity;
        this.unit = unit;
        this.isHarmful = isHarmful;
        this.safetyLevel = safetyLevel;
    }

    // ======================
    // Getters & Setters
    // ======================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getChemicalName() {
        return chemicalName;
    }

    public void setChemicalName(String chemicalName) {
        this.chemicalName = chemicalName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Boolean getIsHarmful() {
        return isHarmful;
    }

    public void setIsHarmful(Boolean isHarmful) {
        this.isHarmful = isHarmful;
    }

    public SafetyLevel getSafetyLevel() {
        return safetyLevel;
    }

    public void setSafetyLevel(SafetyLevel safetyLevel) {
        this.safetyLevel = safetyLevel;
    }

    // ======================
    // Enum
    // ======================

    public enum SafetyLevel {
        SAFE, MODERATE, HARMFUL
    }
}
