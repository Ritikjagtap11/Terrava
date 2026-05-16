import Web3 from 'web3';

// Import contract ABI (you'll get this after compiling smart contracts)
const CONTRACT_ABI = []; // Add your contract ABI here
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export class Web3Service {
  constructor() {
    this.web3 = null;
    this.contract = null;
  }

  async init() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      return true;
    }
    return false;
  }

  async connectWallet() {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async registerProduct(productData, fromAddress) {
    try {
      const result = await this.contract.methods
        .registerProduct(
          productData.name,
          productData.category,
          this.web3.utils.toWei(productData.price.toString(), 'ether'),
          productData.quantity,
          productData.ipfsHash
        )
        .send({ from: fromAddress });
      
      return result.transactionHash;
    } catch (error) {
      console.error('Error registering product:', error);
      throw error;
    }
  }

  async verifyProduct(productId, fromAddress) {
    try {
      const result = await this.contract.methods
        .verifyProduct(productId)
        .send({ from: fromAddress });
      
      return result.transactionHash;
    } catch (error) {
      console.error('Error verifying product:', error);
      throw error;
    }
  }

  async getProduct(productId) {
    try {
      const product = await this.contract.methods
        .getProduct(productId)
        .call();
      
      return product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  async createOrder(orderData, fromAddress, value) {
    try {
      const result = await this.contract.methods
        .createOrder(
          orderData.orderNumber,
          orderData.productIds,
          orderData.quantities,
          orderData.prices
        )
        .send({ from: fromAddress, value });
      
      return result.transactionHash;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}

export const web3Service = new Web3Service();