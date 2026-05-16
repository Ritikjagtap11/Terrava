import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isProcessing = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md pointer-events-auto border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl text-red-600 dark:text-red-400">
                  <ExclamationTriangleIcon className="h-8 w-8 stroke-2" />
                </div>
                {!isProcessing && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                  >
                    <XMarkIcon className="h-6 w-6 stroke-2" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                {message}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
