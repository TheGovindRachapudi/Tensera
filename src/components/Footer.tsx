import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Stock Dashboard</h3>
            <p className="text-gray-400 text-sm">
              AI-powered stock market analytics and predictions to help you make informed investment decisions.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Features</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white">Real-time Data</a></li>
              <li><a href="#" className="hover:text-white">AI Predictions</a></li>
              <li><a href="#" className="hover:text-white">Portfolio Tracking</a></li>
              <li><a href="#" className="hover:text-white">Market Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Support</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">API Reference</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Legal</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              <li><a href="#" className="hover:text-white">Risk Notice</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Stock Dashboard. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                📊 Demo Mode - Sample Data
              </span>
              <span className="text-gray-400 text-sm">
                Last Updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
