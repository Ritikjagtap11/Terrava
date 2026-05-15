# Terra Luxe (Terrava)

Terra Luxe (formerly Terrava) is an agricultural supply chain management platform utilizing blockchain technology to ensure end-to-end traceability, transparency, and fair market access for farmers and consumers.

## 🚀 Features
- **Blockchain Security**: Immutable records ensure transparency and prevent tampering of supply chain data.
- **End-to-End Traceability**: Track products from soil to shelf, knowing exactly where your food comes from.
- **Smart Logistics Tracking**: Real-time updates on transport conditions and delivery status.
- **Farmer Empowerment**: Direct market access for farmers, ensuring fair prices and faster payments.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS (Deep Greens & Gold theme), Framer Motion
- **Backend**: Java 17, Spring Boot 3, Spring Security, Hibernate, MySQL
- **Blockchain**: Solidity, Truffle, Web3j, Ethereum (Local Ganache/Testnet)
- **Authentication**: JWT (JSON Web Tokens)

## 📂 Folder Structure
```
Terrava/
├── backend/            # Spring Boot application & APIs
├── blockchain/         # Truffle project, Solidity contracts, and migrations
├── frontend/           # React frontend application
├── README.md           # Project documentation
└── SETUP_GUIDE.txt     # Step-by-step installation instructions
```

## 🎨 Theme Details (Terra Luxe)
- **Deep Green**: `#0D4A30`
- **Emerald**: `#2A8A5C`
- **Gold**: `#D4A843`
- **Shine**: `#EDD26A`
- **Background**: Warm Cream `#F5F0E8`

## 🔒 Security
- Replaced dummy simulateTransactions with actual `Web3j` function encoding.
- Hardcoded sensitive keys moved out of properties.
- Replaced default browser `alert()` and `prompt()` with secure, styled custom modals.

## 📄 License
This project is licensed under the MIT License.
