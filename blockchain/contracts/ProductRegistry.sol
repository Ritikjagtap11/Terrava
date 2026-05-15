// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    
    struct ProductCertification {
        string certificationType; // Organic, Non-GMO, etc.
        string certifier;
        uint256 issueDate;
        uint256 expiryDate;
        bool isValid;
    }
    
    struct ChemicalInfo {
        string chemicalName;
        uint256 quantity;
        string unit;
        bool isHarmful;
        string safetyLevel; // SAFE, MODERATE, HARMFUL
    }
    
    struct NutrientInfo {
        string nutrientName;
        uint256 value;
        string unit;
        uint256 dailyValuePercentage;
    }
    
    mapping(uint256 => ProductCertification[]) public productCertifications;
    mapping(uint256 => ChemicalInfo[]) public productChemicals;
    mapping(uint256 => NutrientInfo[]) public productNutrients;
    mapping(uint256 => string) public productGrowingMethods;
    
    event CertificationAdded(uint256 indexed productId, string certificationType);
    event ChemicalAdded(uint256 indexed productId, string chemicalName);
    event NutrientAdded(uint256 indexed productId, string nutrientName);
    
    /**
     * @dev Add certification to a product
     */
    function addCertification(
        uint256 _productId,
        string memory _certificationType,
        string memory _certifier,
        uint256 _issueDate,
        uint256 _expiryDate
    ) public {
        productCertifications[_productId].push(ProductCertification({
            certificationType: _certificationType,
            certifier: _certifier,
            issueDate: _issueDate,
            expiryDate: _expiryDate,
            isValid: true
        }));
        
        emit CertificationAdded(_productId, _certificationType);
    }
    
    /**
     * @dev Add chemical information
     */
    function addChemical(
        uint256 _productId,
        string memory _chemicalName,
        uint256 _quantity,
        string memory _unit,
        bool _isHarmful,
        string memory _safetyLevel
    ) public {
        productChemicals[_productId].push(ChemicalInfo({
            chemicalName: _chemicalName,
            quantity: _quantity,
            unit: _unit,
            isHarmful: _isHarmful,
            safetyLevel: _safetyLevel
        }));
        
        emit ChemicalAdded(_productId, _chemicalName);
    }
    
    /**
     * @dev Add nutrient information
     */
    function addNutrient(
        uint256 _productId,
        string memory _nutrientName,
        uint256 _value,
        string memory _unit,
        uint256 _dailyValuePercentage
    ) public {
        productNutrients[_productId].push(NutrientInfo({
            nutrientName: _nutrientName,
            value: _value,
            unit: _unit,
            dailyValuePercentage: _dailyValuePercentage
        }));
        
        emit NutrientAdded(_productId, _nutrientName);
    }
    
    /**
     * @dev Set growing method
     */
    function setGrowingMethod(uint256 _productId, string memory _method) public {
        productGrowingMethods[_productId] = _method;
    }
    
    /**
     * @dev Get product certifications
     */
    function getCertifications(uint256 _productId) 
        public 
        view 
        returns (ProductCertification[] memory) 
    {
        return productCertifications[_productId];
    }
    
    /**
     * @dev Get product chemicals
     */
    function getChemicals(uint256 _productId) 
        public 
        view 
        returns (ChemicalInfo[] memory) 
    {
        return productChemicals[_productId];
    }
    
    /**
     * @dev Get product nutrients
     */
    function getNutrients(uint256 _productId) 
        public 
        view 
        returns (NutrientInfo[] memory) 
    {
        return productNutrients[_productId];
    }
}