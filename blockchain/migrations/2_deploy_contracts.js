const AgriSupplyChain = artifacts.require("AgriSupplyChain");
const ProductRegistry = artifacts.require("ProductRegistry");

module.exports = function (deployer) {
  deployer.deploy(AgriSupplyChain);
  deployer.deploy(ProductRegistry);
};