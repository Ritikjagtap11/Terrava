# Terra Luxe (formerly Terrava)

![Terra Luxe Banner](https://img.shields.io/badge/Terra_Luxe-Premium_AgriTech-0D4A30?style=for-the-badge)

Terra Luxe is a premium, state-of-the-art agricultural supply chain management platform. It utilizes blockchain technology to ensure end-to-end traceability, absolute transparency, and fair market access for both farmers and consumers. Built with a luxurious "Deep Greens & Gold" aesthetic, the platform combines the usability of a modern SaaS application with the reliability of Ethereum smart contracts.

## 🌟 Key Features

### 🛡️ Immutable Blockchain Security
- **Smart Contracts**: Powered by Solidity smart contracts deployed on Ethereum/Ganache.
- **Tamper-Proof Records**: Every product registration and order lifecycle change is immutably hashed and stored on-chain.
- **Transaction Verification**: Built-in verification via Web3j ensuring all supply chain data is authentic.

### 🔍 End-to-End Traceability
- **Soil to Shelf**: Track products from the exact farm origin all the way to the end consumer.
- **Chemical & Nutrient Tracking**: Farmers can log organic certifications, chemical usage, and nutritional values directly to the product registry.
- **IPFS Ready**: Product metadata hashing designed for decentralized storage architectures.

### 🌾 Farmer & Consumer Empowerment
- **Direct Market Access**: Farmers bypass traditional middlemen to sell directly, ensuring fair pricing and faster payouts.
- **Dynamic Role Dashboards**: Specialized portals tailored specifically for `FARMER` and `CUSTOMER` roles.
- **Secure Authentication**: Robust JWT-based security with encrypted passwords.

### 💎 Premium User Experience (UX/UI)
- **Deep Greens & Gold Theme**: A custom Tailwind CSS theme bringing a premium, organic feel to the application.
- **Custom Modals**: Complete replacement of native browser alerts with beautifully animated Framer Motion dialogue boxes.
- **Responsive & Fast**: Built on Vite and React 18 for lightning-fast module replacement and rendering.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS, PostCSS, Custom Global CSS
- **Animations**: Framer Motion
- **State Management & Routing**: Zustand, React Router DOM v6
- **Web3**: `web3.js` for blockchain interactions

### Backend
- **Framework**: Java 17, Spring Boot 3
- **Security**: Spring Security + JWT Tokens
- **Database**: MySQL 8.0, Hibernate JPA
- **Blockchain Integration**: `web3j` for signing and executing smart contract transactions in Java

### Blockchain
- **Network**: Local Ethereum (Ganache) / Testnets
- **Development**: Truffle Suite
- **Language**: Solidity `^0.8.0`

---

## 📂 Project Structure

```text
Terrava/
├── backend/            # Spring Boot REST APIs, Web3j integration, JWT Security
├── blockchain/         # Truffle project, Solidity Smart Contracts, ABI builds
├── frontend/           # React frontend application, Tailwind config, UI Components
├── README.md           # Project documentation (You are here!)
└── SETUP_GUIDE.txt     # Deep step-by-step setup instructions for new PCs
```

## 🚀 Getting Started

If you are setting up this project on a new PC, please refer strictly to the **`SETUP_GUIDE.txt`** located in the root directory. It contains exact, step-by-step instructions on:
1. Installing prerequisites (Git, Node, Java, MySQL, Ganache).
2. Cloning the repository.
3. Deploying the local blockchain contracts.
4. Starting the backend and frontend servers.
5. Verifying mined blocks and transactions via Ganache.

## 📄 License
This project is licensed under the MIT License.
