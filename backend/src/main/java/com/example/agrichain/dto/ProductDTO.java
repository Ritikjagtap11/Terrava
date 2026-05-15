package com.example.agrichain.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private String unit;
    private String growingMethod;
    private LocalDate harvestDate;
    private String certification;
    private String imageUrl;
    private String blockchainHash;
    private Boolean isVerified;
    private Long farmerId;
    private String farmerName;
    private List<ChemicalDTO> chemicals;
    private List<NutrientDTO> nutrients;

    // ======================
    // Getters & Setters
    // ======================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getGrowingMethod() {
        return growingMethod;
    }

    public void setGrowingMethod(String growingMethod) {
        this.growingMethod = growingMethod;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public String getCertification() {
        return certification;
    }

    public void setCertification(String certification) {
        this.certification = certification;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getBlockchainHash() {
        return blockchainHash;
    }

    public void setBlockchainHash(String blockchainHash) {
        this.blockchainHash = blockchainHash;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean verified) {
        isVerified = verified;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public List<ChemicalDTO> getChemicals() {
        return chemicals;
    }

    public void setChemicals(List<ChemicalDTO> chemicals) {
        this.chemicals = chemicals;
    }

    public List<NutrientDTO> getNutrients() {
        return nutrients;
    }

    public void setNutrients(List<NutrientDTO> nutrients) {
        this.nutrients = nutrients;
    }

    // ======================
    // ChemicalDTO
    // ======================

    public static class ChemicalDTO {

        private String chemicalName;
        private BigDecimal quantity;
        private String unit;
        private Boolean isHarmful;
        private String safetyLevel;

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

        public void setIsHarmful(Boolean harmful) {
            isHarmful = harmful;
        }

        public String getSafetyLevel() {
            return safetyLevel;
        }

        public void setSafetyLevel(String safetyLevel) {
            this.safetyLevel = safetyLevel;
        }
    }

    // ======================
    // NutrientDTO
    // ======================

    public static class NutrientDTO {

        private String nutrientName;
        private BigDecimal value;
        private String unit;
        private BigDecimal dailyValuePercentage;

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
}
