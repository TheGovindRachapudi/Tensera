import React from 'react';
import StockCard from './StockCard';
import { useStocks } from '../hooks/useStocks';

const StockList: React.FC = () => {
  const { stocks, loading, error, refetch } = useStocks();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && stocks.length === 0) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <button 
          onClick={refetch} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && stocks.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Warning: {error}. Showing cached data.</p>
        </div>
      )}
      
      {error && stocks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          <p>📊 Demo Mode: Showing sample stock data</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            price={stock.price}
            change={stock.change}
            changePercent={stock.changePercent}
            volume={stock.volume}
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;
