import React, { useState } from 'react';
import { Stock } from '../types';
import StockDetailModal from './StockDetailModal';

interface StockCardProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  price,
  change,
  changePercent,
  volume
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  const stockData: Stock = {
    symbol,
    price,
    change,
    changePercent,
    volume,
    marketCap: price * volume * 0.001,
    high52Week: price * 1.3,
    low52Week: price * 0.7,
    lastUpdated: new Date().toISOString()
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className={`p-4 border rounded-lg shadow-md ${bgColor} hover:shadow-lg transition-shadow cursor-pointer`}
        onClick={handleCardClick}
      >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
        <span className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
        <span className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}${change.toFixed(2)}
        </span>
      </div>
      
        <div className="text-sm text-gray-600">
          Volume: {volume.toLocaleString()}
        </div>
      </div>
      
      <StockDetailModal 
        stock={stockData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default StockCard;
