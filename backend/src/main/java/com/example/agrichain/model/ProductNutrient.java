package com.example.agrichain.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_nutrients")
public class ProductNutrient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "nutrient_name", nullable = false, length = 100)
    private String nutrientName;

    @Column(precision = 10, scale = 2)
    private BigDecimal value;

    @Column(length = 20)
    private String unit;

    @Column(name = "daily_value_percentage", precision = 5, scale = 2)
    private BigDecimal dailyValuePercentage;

    // ======================
    // Constructors
    // ======================

    public ProductNutrient() {
    }

    public ProductNutrient(Long id, Product product, String nutrientName,
                           BigDecimal value, String unit,
                           BigDecimal dailyValuePercentage) {
        this.id = id;
        this.product = product;
        this.nutrientName = nutrientName;
        this.value = value;
        this.unit = unit;
        this.dailyValuePercentage = dailyValuePercentage;
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

    public String getNutrientName() {
        return nutrientName;
    }

    public void setNutrientName(String nutrientName) {
        this.nutrientName = nutrientName;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getDailyValuePercentage() {
        return dailyValuePercentage;
    }

    public void setDailyValuePercentage(BigDecimal dailyValuePercentage) {
        this.dailyValuePercentage = dailyValuePercentage;
    }
}
