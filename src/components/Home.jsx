import React from 'react';
import { motion } from 'framer-motion';
import logo from "../../public/assets/logo.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheckIcon,
  MagnifyingGlassCircleIcon,
  TruckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleExploreClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'CUSTOMER') {
      navigate('/customer/dashboard');
    } else if (user?.role === 'FARMER') {
      navigate('/farmer/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      name: 'Blockchain Security',
      description: 'Immutable records ensure transparency and prevent tampering of supply chain data.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'End-to-End Traceability',
      description: 'Track products from soil to shelf, knowing exactly where your food comes from.',
      icon: MagnifyingGlassCircleIcon,
    },
    {
      name: 'Smart Logistics Tracking',
      description: 'Real-time updates on transport conditions and delivery status for ultimate freshness.',
      icon: TruckIcon,
    },
    {
      name: 'Farmer Empowerment',
      description: 'Direct market access for farmers, ensuring fair prices and faster payments.',
      icon: UserGroupIcon,
    },
  ];

  const steps = [
    {
      id: '01',
      name: 'Farmer uploads product',
      description: 'Verified farmers list their fresh produce with complete origin details on Terrava.',
    },
    {
      id: '02',
      name: 'Blockchain records transactions',
      description: 'Every step, from purchase to transit, is permanently recorded on the blockchain.',
    },
    {
      id: '03',
      name: 'Users track delivery & verify authenticity',
      description: 'Consumers and dealers scan or track the product to verify its journey and quality.',
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 md:py-20">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100 via-gray-50 to-gray-50 dark:from-primary-900/40 dark:via-gray-900 dark:to-gray-900 opacity-70"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[600px] h-[600px] rounded-full bg-primary-200/40 dark:bg-primary-900/20 blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[500px] h-[500px] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
              <img src={logo} alt="Terrava Logo" className="w-30 h-40 sm:w-15 sm:h-15 object-contain" />
          </motion.div>

          <motion.h1 
            {...fadeIn}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8"
          >
            The Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-400">
              Food Supply Chains
            </span> Starts Here
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto mb-10"
          >
            Terrava uses blockchain technology to create a transparent, tamper-proof and traceable journey for agricultural products — from farmers to consumers.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <button
              onClick={handleExploreClick}
              className="px-8 py-4 text-lg font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              Explore Platform
            </button>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Home;