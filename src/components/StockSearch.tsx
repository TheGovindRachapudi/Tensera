import React, { useState, useEffect } from 'react';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  loading: boolean;
}

const popularSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' }
];

const StockSearch: React.FC<StockSearchProps> = ({ onSearch, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [suggestions, setSuggestions] = useState<typeof popularSymbols>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = popularSymbols.filter(stock =>
        stock.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
        stock.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const validateInput = (value: string) => {
    // Basic validation for stock symbols (letters, numbers, dots)
    const stockSymbolRegex = /^[A-Za-z0-9.]*$/;
    return stockSymbolRegex.test(value) && value.length <= 10;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    setIsValid(validateInput(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && isValid) {
      onSearch(inputValue.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    setInputValue(symbol);
    setShowSuggestions(false);
    onSearch(symbol);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter stock symbol (e.g., AAPL, GOOGL)"
            className={`w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
              isValid
                ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                : 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            }`}
            disabled={loading}
          />
          {!isValid && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
          )}
        </div>

        {!isValid && (
          <div className="text-red-400 text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span>Please enter a valid stock symbol (letters, numbers, and dots only)</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!inputValue.trim() || !isValid || loading}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 ${
            !inputValue.trim() || !isValid || loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>🎯</span>
              <span>Get AI Prediction</span>
            </div>
          )}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto">
          {suggestions.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSuggestionClick(stock.symbol)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between group"
            >
              <div>
                <div className="text-white font-semibold">{stock.symbol}</div>
                <div className="text-gray-400 text-sm">{stock.name}</div>
              </div>
              <div className="text-gray-500 group-hover:text-white transition-colors duration-200">
                →
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Popular Symbols */}
      <div className="mt-6">
        <h3 className="text-gray-400 text-sm mb-3 flex items-center space-x-2">
          <span>⭐</span>
          <span>Popular Symbols</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {popularSymbols.slice(0, 8).map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSuggestionClick(stock.symbol)}
              disabled={loading}
              className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stock.symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockSearch;
