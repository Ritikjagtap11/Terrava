import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Web3Provider } from "./context/Web3Context";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import EditProduct from "./components/farmer/EditProduct";

// Layout Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Farmer Components
import FarmerDashboard from "./components/farmer/FarmerDashboard";
import AddProduct from "./components/farmer/AddProduct";

// Customer Components
import ProductCatalog from "./components/customer/ProductCatalog";
import ProductDetail from "./components/customer/ProductDetail";
import Cart from "./components/customer/Cart";
import Checkout from "./components/customer/Checkout";
import CustomerDashboard from "./components/customer/CustomerDashboard";


// Home Component
import Home from "./components/Home";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (user) {
    if (user.role === "FARMER") return <Navigate to="/farmer/dashboard" />;
    if (user.role === "CUSTOMER") return <Navigate to="/products" />;
  }

  return children;
};

function AppRoutes() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className={`flex-grow ${!isHomePage ? "pt-24" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Farmer Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["FARMER"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/edit-product/:id"
            element={
              <ProtectedRoute allowedRoles={["FARMER"]}>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer/add-product"
            element={
              <ProtectedRoute allowedRoles={["FARMER"]}>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />


          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Web3Provider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </Web3Provider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
