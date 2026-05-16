import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "../../../public/assets/logo.png";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  ShoppingCartIcon,
  WalletIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { account, connectWallet, isConnected } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/login');
  };

  const navClasses = `fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome || drawerOpen
      ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3'
      : 'bg-transparent py-5'
    }`;

  const logoColor = scrolled || !isHome || drawerOpen ? 'text-primary-600 dark:text-primary-400' : 'text-primary-700 dark:text-primary-400';
  const iconColor = scrolled || !isHome || drawerOpen ? 'text-gray-700 dark:text-gray-300' : 'text-gray-800 dark:text-gray-200';

  // Helper for drawer links
  const DrawerLink = ({ to, icon: Icon, label, onClick }) => (
    <Link
      to={to}
      onClick={() => {
        if (onClick) onClick();
        setDrawerOpen(false);
      }}
      className="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-bold"
    >
      <Icon className="h-6 w-6 text-primary-500" />
      <span className="text-lg">{label}</span>
    </Link>
  );

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* LEFT: Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center" onClick={() => setDrawerOpen(false)}>
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                  {/* Logo Image */}
                  <img
                    src={logo}
                    alt="Terrava Logo"
                    className="h-40 w-40 object-contain"
                  />
                </motion.div>
              </Link>
            </div>

            {/* RIGHT: Theme Toggle + Menu Icon */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={`${iconColor} hover:text-primary-500 transition-colors p-1`}
              >
                {drawerOpen ? (
                  <XMarkIcon className="h-8 w-8 stroke-2" />
                ) : (
                  <Bars3Icon className="h-8 w-8 stroke-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-height Drawer Menu (Slide out from right) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">Menu</span>
                  <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
                    <XMarkIcon className="h-8 w-8" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 p-6 flex flex-col space-y-6">

                  {/* Profile Section for Authenticated Users */}
                  {isAuthenticated && user && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center space-x-4 mb-2">
                      <div className="bg-primary-100 dark:bg-primary-900/40 p-3 rounded-full">
                        <UserCircleIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Logged in as</p>
                        <p className="text-xl font-extrabold text-gray-900 dark:text-white truncate">{user.username}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-2 flex-1">
                    <DrawerLink to="/" icon={HomeIcon} label="Home" />

                    {!isAuthenticated && (
                      <>
                        <DrawerLink to="/login" icon={UserCircleIcon} label="Login" />
                        <DrawerLink to="/register" icon={ArrowRightOnRectangleIcon} label="Sign Up" />
                      </>
                    )}

                    {isAuthenticated && user.role === 'CUSTOMER' && (
                      <>
                        <DrawerLink to="/products" icon={ShoppingBagIcon} label="Products" />
                        <DrawerLink to="/customer/dashboard" icon={CubeIcon} label="My Orders" />
                        <DrawerLink to="/cart" icon={ShoppingCartIcon} label="Cart" />
                      </>
                    )}

                    {isAuthenticated && user.role === 'FARMER' && (
                      <>
                        <DrawerLink to="/farmer/dashboard" icon={Squares2X2Icon} label="Dashboard" />
                        <DrawerLink to="/products" icon={ShoppingBagIcon} label="Products" />
                      </>
                    )}
                  </div>

                  {/* Bottom Actions (Wallet & Logout) */}
                  <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    {/* Wallet Button */}
                    {isConnected ? (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 px-4 py-4 rounded-xl border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 font-bold">
                        <div className="flex items-center space-x-3">
                          <WalletIcon className="h-6 w-6" />
                          <span>Wallet Connected</span>
                        </div>
                        <span className="text-xs opacity-70 truncate max-w-[100px]">{account?.substring(0, 6)}...</span>
                      </div>
                    ) : (
                      <button
                        onClick={connectWallet}
                        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white px-4 py-4 rounded-xl font-extrabold text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <WalletIcon className="h-6 w-6 stroke-2" />
                        <span>Connect Wallet</span>
                      </button>
                    )}

                    {/* Logout Button */}
                    {isAuthenticated && (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-bold transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-6 w-6" />
                        <span className="text-lg">Logout</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;