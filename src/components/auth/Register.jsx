import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    fullName: '',
    phone: '',
    address: '',
    walletAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      
      // Redirect based on role
      switch (formData.role) {
        case 'FARMER':
          navigate('/farmer/dashboard');
          break;
        case 'CUSTOMER':
          navigate('/products');
          break;

        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-200";
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3">Join the Terrava community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className={inputClasses}
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className={inputClasses}
                placeholder="Enter confirm password"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="FARMER">Farmer</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter fullname"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={inputClasses}
              placeholder="Enter address"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-8"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-all">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;