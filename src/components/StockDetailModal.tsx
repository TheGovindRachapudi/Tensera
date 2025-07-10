import React from 'react';
import { Stock } from '../types';
import SimpleChart from './SimpleChart';

interface StockDetailModalProps {
  stock: Stock;
  isOpen: boolean;
  onClose: () => void;
}

const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock chart data for demonstration
  const mockChartData = Array.from({ length: 30 }, (_, i) => ({
    x: i,
    y: stock.price + (Math.random() - 0.5) * 20,
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString()
  }));

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{stock.symbol}</h2>
              <p className="text-gray-600">{stock.name || 'Stock Details'}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Price Information */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Current Price</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${stock.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Change</div>
                    <div className={`text-lg font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Change %</div>
                    <div className={`text-lg font-semibold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Volume</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stock.volume.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <SimpleChart 
                data={mockChartData}
                title={`${stock.symbol} - 30 Day Chart`}
                color={stock.change >= 0 ? '#10b981' : '#ef4444'}
                height={300}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Stock Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Symbol:</span>
                    <span className="font-medium">{stock.symbol}</span>
                  </div>
                  {stock.marketCap && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Cap:</span>
                      <span className="font-medium">${(stock.marketCap / 1e9).toFixed(2)}B</span>
                    </div>
                  )}
                  {stock.high52Week && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">52W High:</span>
                      <span className="font-medium">${stock.high52Week.toFixed(2)}</span>
                    </div>
                  )}
                  {stock.low52Week && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">52W Low:</span>
                      <span className="font-medium">${stock.low52Week.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Trading Activity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume:</span>
                    <span className="font-medium">{stock.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Volume:</span>
                    <span className="font-medium">{Math.round(stock.volume * 0.8).toLocaleString()}</span>
                  </div>
                  {stock.lastUpdated && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium text-xs">
                        {new Date(stock.lastUpdated).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Add to Watchlist
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Get Prediction
                  </button>
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                    View Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailModal;
