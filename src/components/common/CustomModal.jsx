import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const CustomModal = ({ isOpen, onClose, title, message, type = 'info', onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {/* Header strip */}
          <div className={`h-2 w-full ${type === 'error' ? 'bg-red-500' : 'bg-primary-500'}`}></div>
          
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {type === 'error' ? (
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <InformationCircleIcon className="w-6 h-6 text-primary-500" />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-4 text-gray-600 dark:text-gray-300">
              <p>{message}</p>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {onConfirm ? 'Cancel' : 'Close'}
              </button>
              {onConfirm && (
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomModal;
