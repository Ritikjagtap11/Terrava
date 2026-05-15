const AgriSupplyChain = artifacts.require("AgriSupplyChain");

contract("AgriSupplyChain", (accounts) => {
  let agriSupplyChain;
  const farmer = accounts[0];
  const customer = accounts[1];

  before(async () => {
    agriSupplyChain = await AgriSupplyChain.deployed();
  });

  describe("Product Registration", () => {
    it("should register a new product", async () => {
      const result = await agriSupplyChain.registerProduct(
        "Organic Tomatoes",
        "Vegetables",
        web3.utils.toWei("0.01", "ether"),
        100,
        "QmXxxx...", // IPFS hash
        { from: farmer }
      );

      const productCount = await agriSupplyChain.productCount();
      assert.equal(productCount, 1, "Product count should be 1");

      const product = await agriSupplyChain.getProduct(1);
      assert.equal(product.name, "Organic Tomatoes", "Product name mismatch");
      assert.equal(product.farmer, farmer, "Farmer address mismatch");
    });

    it("should emit ProductRegistered event", async () => {
      const result = await agriSupplyChain.registerProduct(
        "Fresh Carrots",
        "Vegetables",
        web3.utils.toWei("0.005", "ether"),
        200,
        "QmYyyy...",
        { from: farmer }
      );

      assert.equal(result.logs[0].event, "ProductRegistered");
      assert.equal(result.logs[0].args.name, "Fresh Carrots");
    });
  });

  describe("Product Verification", () => {
    it("should verify a product", async () => {
      await agriSupplyChain.verifyProduct(1, { from: accounts[2] });
      const product = await agriSupplyChain.getProduct(1);
      assert.equal(product.isVerified, true, "Product should be verified");
    });
  });

  describe("Order Creation", () => {
    it("should create an order", async () => {
      const productIds = [1];
      const quantities = [10];
      const prices = [web3.utils.toWei("0.01", "ether")];
      const totalAmount = web3.utils.toWei("0.1", "ether");

      const result = await agriSupplyChain.createOrder(
        "ORD-2025-ABC123",
        productIds,
        quantities,
        prices,
        {
          from: customer,
          value: totalAmount
        }
      );

      const orderCount = await agriSupplyChain.orderCount();
      assert.equal(orderCount, 1, "Order count should be 1");

      const order = await agriSupplyChain.getOrder(1);
      assert.equal(order.customer, customer, "Customer address mismatch");
      assert.equal(order.orderNumber, "ORD-2025-ABC123");
    });

    it("should reduce product quantity after order", async () => {
      const product = await agriSupplyChain.getProduct(1);
      assert.equal(product.quantity, 90, "Product quantity should be reduced");
    });
  });

  describe("Order Status Update", () => {
    it("should update order status", async () => {
      await agriSupplyChain.updateOrderStatus(1, 1, { from: farmer }); // 1 = Confirmed
      const order = await agriSupplyChain.getOrder(1);
      assert.equal(order.status, 1, "Order status should be Confirmed");
    });
  });
});