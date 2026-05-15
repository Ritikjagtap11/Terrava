// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriSupplyChain {
    
    // Structs
    struct Product {
        uint256 productId;
        string name;
        string category;
        uint256 price;
        uint256 quantity;
        address farmer;
        string ipfsHash; // Store detailed product info on IPFS
        uint256 timestamp;
        bool isVerified;
    }
    
    struct Order {
        uint256 orderId;
        string orderNumber;
        address customer;
        uint256 totalAmount;
        uint256 timestamp;
        OrderStatus status;
    }
    
    struct OrderItem {
        uint256 productId;
        uint256 quantity;
        uint256 price;
    }
    
    enum OrderStatus {
        Pending,
        Confirmed,
        Shipped,
        Delivered,
        Cancelled
    }
    
    // State variables
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => OrderItem[]) public orderItems;
    mapping(address => uint256[]) public farmerProducts;
    mapping(address => uint256[]) public customerOrders;
    
    uint256 public productCount;
    uint256 public orderCount;
    
    // Events
    event ProductRegistered(
        uint256 indexed productId,
        string name,
        address indexed farmer,
        uint256 timestamp
    );
    
    event ProductVerified(
        uint256 indexed productId,
        address indexed verifier,
        uint256 timestamp
    );
    
    event OrderCreated(
        uint256 indexed orderId,
        string orderNumber,
        address indexed customer,
        uint256 totalAmount,
        uint256 timestamp
    );
    
    event OrderStatusUpdated(
        uint256 indexed orderId,
        OrderStatus newStatus,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyFarmer(uint256 _productId) {
        require(products[_productId].farmer == msg.sender, "Only farmer can perform this action");
        _;
    }
    
    modifier productExists(uint256 _productId) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        _;
    }
    
    modifier orderExists(uint256 _orderId) {
        require(_orderId > 0 && _orderId <= orderCount, "Order does not exist");
        _;
    }
    
    // Functions
    
    /**
     * @dev Register a new product on the blockchain
     */
    function registerProduct(
        string memory _name,
        string memory _category,
        uint256 _price,
        uint256 _quantity,
        string memory _ipfsHash
    ) public returns (uint256) {
        productCount++;
        
        products[productCount] = Product({
            productId: productCount,
            name: _name,
            category: _category,
            price: _price,
            quantity: _quantity,
            farmer: msg.sender,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            isVerified: false
        });
        
        farmerProducts[msg.sender].push(productCount);
        
        emit ProductRegistered(productCount, _name, msg.sender, block.timestamp);
        
        return productCount;
    }
    
    /**
     * @dev Verify a product (can be called by authorized verifiers)
     */
    function verifyProduct(uint256 _productId) 
        public 
        productExists(_productId) 
    {
        products[_productId].isVerified = true;
        emit ProductVerified(_productId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Update product quantity
     */
    function updateProductQuantity(uint256 _productId, uint256 _newQuantity) 
        public 
        productExists(_productId) 
        onlyFarmer(_productId) 
    {
        products[_productId].quantity = _newQuantity;
    }
    
    /**
     * @dev Create a new order
     */
    function createOrder(
        string memory _orderNumber,
        uint256[] memory _productIds,
        uint256[] memory _quantities,
        uint256[] memory _prices
    ) public payable returns (uint256) {
        require(_productIds.length == _quantities.length, "Arrays length mismatch");
        require(_productIds.length == _prices.length, "Arrays length mismatch");
        
        uint256 totalAmount = 0;
        
        // Validate products and calculate total
        for (uint256 i = 0; i < _productIds.length; i++) {
            require(products[_productIds[i]].productId > 0, "Product does not exist");
            require(products[_productIds[i]].quantity >= _quantities[i], "Insufficient quantity");
            
            totalAmount += _prices[i] * _quantities[i];
            
            // Reduce product quantity
            products[_productIds[i]].quantity -= _quantities[i];
        }
        
        require(msg.value >= totalAmount, "Insufficient payment");
        
        orderCount++;
        
        orders[orderCount] = Order({
            orderId: orderCount,
            orderNumber: _orderNumber,
            customer: msg.sender,
            totalAmount: totalAmount,
            timestamp: block.timestamp,
            status: OrderStatus.Pending
        });
        
        // Store order items
        for (uint256 i = 0; i < _productIds.length; i++) {
            orderItems[orderCount].push(OrderItem({
                productId: _productIds[i],
                quantity: _quantities[i],
                price: _prices[i]
            }));
        }
        
        customerOrders[msg.sender].push(orderCount);
        
        emit OrderCreated(orderCount, _orderNumber, msg.sender, totalAmount, block.timestamp);
        
        // Refund excess payment
        if (msg.value > totalAmount) {
            payable(msg.sender).transfer(msg.value - totalAmount);
        }
        
        return orderCount;
    }
    
    /**
     * @dev Update order status
     */
    function updateOrderStatus(uint256 _orderId, OrderStatus _newStatus) 
        public 
        orderExists(_orderId) 
    {
        orders[_orderId].status = _newStatus;
        emit OrderStatusUpdated(_orderId, _newStatus, block.timestamp);
    }
    
    /**
     * @dev Get product details
     */
    function getProduct(uint256 _productId) 
        public 
        view 
        productExists(_productId) 
        returns (
            uint256 productId,
            string memory name,
            string memory category,
            uint256 price,
            uint256 quantity,
            address farmer,
            string memory ipfsHash,
            uint256 timestamp,
            bool isVerified
        ) 
    {
        Product memory p = products[_productId];
        return (
            p.productId,
            p.name,
            p.category,
            p.price,
            p.quantity,
            p.farmer,
            p.ipfsHash,
            p.timestamp,
            p.isVerified
        );
    }
    
    /**
     * @dev Get order details
     */
    function getOrder(uint256 _orderId) 
        public 
        view 
        orderExists(_orderId) 
        returns (
            uint256 orderId,
            string memory orderNumber,
            address customer,
            uint256 totalAmount,
            uint256 timestamp,
            OrderStatus status
        ) 
    {
        Order memory o = orders[_orderId];
        return (
            o.orderId,
            o.orderNumber,
            o.customer,
            o.totalAmount,
            o.timestamp,
            o.status
        );
    }
    
    /**
     * @dev Get order items
     */
    function getOrderItems(uint256 _orderId) 
        public 
        view 
        orderExists(_orderId) 
        returns (OrderItem[] memory) 
    {
        return orderItems[_orderId];
    }
    
    /**
     * @dev Get farmer's products
     */
    function getFarmerProducts(address _farmer) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return farmerProducts[_farmer];
    }
    
    /**
     * @dev Get customer's orders
     */
    function getCustomerOrders(address _customer) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return customerOrders[_customer];
    }
    
    /**
     * @dev Withdraw funds (for farmers to claim payments)
     */
    function withdraw() public {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(msg.sender).transfer(balance);
    }
}