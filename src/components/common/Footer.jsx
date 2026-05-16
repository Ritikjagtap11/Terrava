import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-primary-50/50 dark:from-gray-900 dark:to-gray-800 border-t border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        
        {/* Team Members Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
            Team Members
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {['Bhushan Gavale', 'Bhushan More', 'Parthiv Patil'].map((member) => (
              <div 
                key={member}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm font-semibold text-gray-700 dark:text-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {member}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200/60 dark:border-gray-700/60 pt-8">
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Terrava. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;