import React from 'react';
import { StockPrediction } from '../types';

interface PredictionCardProps {
  prediction: StockPrediction;
  onClick?: () => void;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onClick }) => {
  const {
    symbol,
    currentPrice,
    predictedPrice,
    priceChange,
    priceChangePercent,
    confidence,
    timeframe,
    predictionDate,
    factors
  } = prediction;

  const isPositive = priceChange >= 0;
  const confidenceColor = 
    confidence >= 0.8 ? 'text-green-600' : 
    confidence >= 0.6 ? 'text-yellow-600' : 
    'text-red-600';

  const borderColor = isPositive ? 'border-l-green-500' : 'border-l-red-500';

  return (
    <div 
      className={`bg-white rounded-lg shadow-md border-l-4 ${borderColor} p-6 hover:shadow-lg transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{symbol}</h3>
          <span className="text-sm text-gray-500 capitalize">{timeframe} term</span>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${confidenceColor}`}>
            {(confidence * 100).toFixed(1)}% confidence
          </div>
          <div className="text-xs text-gray-500">
            {new Date(predictionDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-600">Current Price</label>
          <div className="text-xl font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Predicted Price</label>
          <div className="text-xl font-bold text-gray-900">
            ${predictedPrice.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Expected Change</span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </span>
        </div>
        <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}${priceChange.toFixed(2)}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Confidence Level</span>
          <span className={`text-sm font-medium ${confidenceColor}`}>
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              confidence >= 0.8 ? 'bg-green-600' : 
              confidence >= 0.6 ? 'bg-yellow-600' : 
              'bg-red-600'
            }`}
            style={{ width: `${confidence * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Top Factors */}
      {factors && factors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors</h4>
          <div className="space-y-1">
            {factors.slice(0, 3).map((factor, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-600 truncate">{factor.name}</span>
                <span className="font-medium ml-2">
                  {(factor.weight * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
