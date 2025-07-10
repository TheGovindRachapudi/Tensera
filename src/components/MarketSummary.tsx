import React from 'react';

interface MarketSummaryProps {
  totalStocks: number;
  gainers: number;
  losers: number;
  unchanged: number;
  marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours';
  lastUpdated?: string;
}

const MarketSummary: React.FC<MarketSummaryProps> = ({
  totalStocks,
  gainers,
  losers,
  unchanged,
  marketStatus,
  lastUpdated
}) => {
  const getMarketStatusColor = () => {
    switch (marketStatus) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pre-market':
      case 'after-hours':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMarketStatusText = () => {
    switch (marketStatus) {
      case 'open':
        return '🟢 Market Open';
      case 'closed':
        return '🔴 Market Closed';
      case 'pre-market':
        return '🟡 Pre-Market';
      case 'after-hours':
        return '🟡 After Hours';
      default:
        return '⚪ Unknown';
    }
  };

  const gainerPercent = totalStocks > 0 ? (gainers / totalStocks) * 100 : 0;
  const loserPercent = totalStocks > 0 ? (losers / totalStocks) * 100 : 0;
  const unchangedPercent = totalStocks > 0 ? (unchanged / totalStocks) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2 lg:mb-0">
          Market Summary
        </h2>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getMarketStatusColor()}`}>
            {getMarketStatusText()}
          </div>
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stocks */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalStocks}</div>
          <div className="text-sm text-gray-600">Total Stocks</div>
        </div>

        {/* Gainers */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{gainers}</div>
          <div className="text-sm text-gray-600">
            Gainers ({gainerPercent.toFixed(1)}%)
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${gainerPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Losers */}
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{losers}</div>
          <div className="text-sm text-gray-600">
            Losers ({loserPercent.toFixed(1)}%)
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loserPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Unchanged */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{unchanged}</div>
          <div className="text-sm text-gray-600">
            Unchanged ({unchangedPercent.toFixed(1)}%)
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gray-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${unchangedPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Market Sentiment Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Market Sentiment</span>
          <div className="flex items-center gap-2">
            {gainerPercent > loserPercent ? (
              <span className="text-green-600 font-medium">📈 Bullish</span>
            ) : loserPercent > gainerPercent ? (
              <span className="text-red-600 font-medium">📉 Bearish</span>
            ) : (
              <span className="text-gray-600 font-medium">➡️ Neutral</span>
            )}
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full relative"
          >
            <div 
              className="absolute top-0 w-1 h-3 bg-white border border-gray-400 rounded-full transform -translate-x-1/2"
              style={{ left: `${50 + (gainerPercent - loserPercent) * 0.5}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;
