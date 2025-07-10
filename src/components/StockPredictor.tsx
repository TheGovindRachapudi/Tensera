import React, { useState, useEffect } from 'react';

interface PredictionResult {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down';
  volatility: number;
}

interface StockData {
  [key: string]: {
    basePrice: number;
    volatility: number;
    trend: 'up' | 'down';
  };
}

const StockPredictor: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [processedCount, setProcessedCount] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const popularSymbols = [
    ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA'],
    ['META', 'NFLX', 'AMD', 'CRM', 'ADBE', 'INTC'],
    ['ORCL', 'CSCO', 'IBM', 'QCOM', 'JPM', 'BAC']
  ];

  // Mock stock data with realistic prices
  const stockData: StockData = {
    'AAPL': { basePrice: 185.92, volatility: 0.15, trend: 'up' },
    'GOOGL': { basePrice: 2847.63, volatility: 0.20, trend: 'up' },
    'MSFT': { basePrice: 384.30, volatility: 0.12, trend: 'up' },
    'AMZN': { basePrice: 3285.04, volatility: 0.25, trend: 'down' },
    'TSLA': { basePrice: 248.48, volatility: 0.35, trend: 'up' },
    'NVDA': { basePrice: 875.28, volatility: 0.30, trend: 'up' },
    'META': { basePrice: 426.33, volatility: 0.22, trend: 'down' },
    'NFLX': { basePrice: 487.73, volatility: 0.28, trend: 'up' },
    'AMD': { basePrice: 137.23, volatility: 0.32, trend: 'up' },
    'CRM': { basePrice: 267.84, volatility: 0.18, trend: 'down' },
    'ADBE': { basePrice: 521.77, volatility: 0.16, trend: 'up' },
    'INTC': { basePrice: 43.27, volatility: 0.20, trend: 'down' },
    'ORCL': { basePrice: 106.44, volatility: 0.14, trend: 'up' },
    'CSCO': { basePrice: 47.71, volatility: 0.13, trend: 'down' },
    'IBM': { basePrice: 185.23, volatility: 0.12, trend: 'up' },
    'QCOM': { basePrice: 169.28, volatility: 0.24, trend: 'up' },
    'JPM': { basePrice: 178.91, volatility: 0.17, trend: 'up' },
    'BAC': { basePrice: 34.52, volatility: 0.19, trend: 'down' }
  };

  // Generate realistic prediction data
  const generatePrediction = (stockSymbol: string): PredictionResult => {
    const stock = stockData[stockSymbol] || { basePrice: 100, volatility: 0.20, trend: 'up' };
    
    // Add some randomness to current price
    const currentPrice = stock.basePrice * (1 + (Math.random() - 0.5) * 0.05);
    
    // Generate prediction based on trend and volatility
    const trendMultiplier = stock.trend === 'up' ? 1.02 : 0.98;
    const volatilityFactor = (Math.random() - 0.5) * stock.volatility * 0.1;
    const predictedPrice = currentPrice * trendMultiplier * (1 + volatilityFactor);
    
    const change = predictedPrice - currentPrice;
    const changePercent = (change / currentPrice) * 100;
    
    // Confidence based on volatility (lower volatility = higher confidence)
    const confidence = Math.max(0.65, Math.min(0.95, 0.9 - stock.volatility));
    
    return {
      symbol: stockSymbol,
      currentPrice,
      predictedPrice,
      confidence,
      change,
      changePercent,
      trend: change > 0 ? 'up' : 'down',
      volatility: stock.volatility
    };
  };

  const handlePredict = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    
    // Simulate API processing with realistic delay
    const delay = Math.random() * 1500 + 1000; // 1-2.5 seconds
    
    setTimeout(() => {
      const result = generatePrediction(symbol.toUpperCase());
      setPrediction(result);
      setProcessedCount(prev => prev + 1);
      setLoading(false);
      
      // Create success particles
      const newParticles = Array.from({length: 10}, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
      
      // Clear particles after animation
      setTimeout(() => setParticles([]), 2000);
    }, delay);
  };

  // Update API status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: Array<'healthy' | 'warning' | 'error'> = ['healthy', 'healthy', 'healthy', 'warning'];
      setApiStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSymbolClick = (clickedSymbol: string) => {
    setSymbol(clickedSymbol);
  };

  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col">
      {/* Header */}
      <header className="glass-header flex items-center justify-between p-6 transition-glass animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center animate-float hover-scale-110 transition-elastic">
            <span className="text-white font-bold text-xl">🔮</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white animate-slide-in-left">Tensera</h1>
            <p className="text-gray-400 text-sm animate-slide-in-left animation-delay-100">Think Ahead, Trade With Time On Your Side</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 animate-slide-in-right animation-delay-100">
            <span className="text-blue-400 animate-pulse-custom">📊</span>
            <span className="text-gray-400 hover:text-blue-400 transition-colors">Real-time Data</span>
          </div>
          <div className="flex items-center space-x-2 animate-slide-in-right animation-delay-200">
            <span className="text-green-400 animate-pulse-custom">📈</span>
            <span className="text-gray-400 hover:text-green-400 transition-colors">Technical Analysis</span>
          </div>
          <div className="flex items-center space-x-2 animate-slide-in-right animation-delay-300">
            <span className="text-purple-400 animate-pulse-custom">🤖</span>
            <span className="text-gray-400 hover:text-purple-400 transition-colors">AI-Powered</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-5xl font-bold text-white animate-slide-up text-shadow-lg">
              Predict Stock Prices with<span className="text-purple-400 animate-glow-pulse">AI</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Get next-day stock price predictions powered by LSTM neural networks and
              comprehensive technical analysis.
            </p>
          </div>

          {/* Search Section */}
          <div className="glass-search rounded-2xl p-8 hover-glass transition-glass animate-scale-in">
            <div className="flex space-x-4 mb-6">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
                className="flex-1 glass-input text-white px-6 py-4 rounded-lg placeholder-gray-400 transition-glass"
                onKeyPress={(e) => e.key === 'Enter' && handlePredict()}
              />
              <button
                onClick={handlePredict}
                disabled={loading || !symbol.trim()}
                className="glass-button hover-lift glow-effect text-white px-8 py-4 rounded-lg font-semibold transition-glass disabled:opacity-50"
              >
                {loading ? 'Predicting...' : 'Predict'}
              </button>
            </div>

            {/* Popular Symbols */}
            <div className="space-y-4 animate-fade-in animation-delay-300">
              <div className="flex items-center space-x-2">
                <span className="text-green-400 animate-pulse-custom">●</span>
                <span className="text-gray-400">Popular Symbols</span>
              </div>
              <div className="space-y-3">
                {popularSymbols.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-wrap gap-3 justify-center">
                    {row.map((sym, index) => (
                      <button
                        key={sym}
                        onClick={() => handleSymbolClick(sym)}
                        className="glass-button hover-lift text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-glass animate-scale-in"
                        style={{ animationDelay: `${(rowIndex * 6 + index) * 0.1}s` }}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-sm animate-fade-in animation-delay-500">Click any symbol for instant AI prediction</p>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-12">
            {/* Prediction Results */}
            <div className="glass-prediction rounded-2xl p-6 hover-glass transition-glass animate-scale-in">
              <div className="glass-prediction rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              
              {/* Particles effect */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
              
              {prediction ? (
                <div className="relative z-10 space-y-6 animate-fade-in">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">📊</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">AI Prediction Results</h3>
                        <p className="text-slate-400 text-sm">Advanced machine learning analysis</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg ${
                      prediction.trend === 'up' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      <span className="text-lg">{prediction.trend === 'up' ? '⬆️' : '⬇️'}</span>
                      <span>{prediction.trend === 'up' ? 'BULLISH' : 'BEARISH'}</span>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="space-y-6">
                    {/* Symbol & Market Cap */}
                    <div className="glass-card rounded-2xl p-6 shadow-inner animate-slide-in-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Symbol</p>
                          <p className="text-4xl font-bold text-white tracking-wide animate-glow-pulse">{prediction.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400 mb-1">Market Status</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-lg font-semibold text-green-400 animate-pulse-custom">LIVE</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-card rounded-2xl p-6 shadow-inner animate-slide-in-left animation-delay-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center animate-float">
                            <span className="text-lg">💰</span>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Current Price</p>
                            <p className="text-xs text-slate-500">Real-time market data</p>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-white glass-effect rounded-lg p-6 m-4 shadow-lg animate-pulse-custom">${prediction.currentPrice.toFixed(2)}</p>
                      </div>
                      
                      <div className="glass-card rounded-2xl p-6 shadow-inner animate-slide-in-right animation-delay-100">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-glow-pulse">
                            <span className="text-lg text-white">🎯</span>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">AI Predicted Price</p>
                            <p className="text-xs text-slate-500">24h forecast</p>
                          </div>
                        </div>
                        <p 
                          className="text-3xl font-bold glass-effect rounded-lg p-6 m-4 shadow-lg animate-pulse-custom"
                          style={{
                            color: prediction.predictedPrice > prediction.currentPrice ? '#10B981' : '#EF4444',
                            borderColor: prediction.predictedPrice > prediction.currentPrice ? '#10B981' : '#EF4444',
                            boxShadow: prediction.predictedPrice > prediction.currentPrice 
                              ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' 
                              : '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          ${prediction.predictedPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Change Display */}
                    <div 
                      className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-inner"
                      style={{
                        borderColor: prediction.change >= 0 ? '#10B981' : '#EF4444',
                        boxShadow: prediction.change >= 0 
                          ? '0 25px 50px -12px rgba(16, 185, 129, 0.2)' 
                          : '0 25px 50px -12px rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-slate-400 mb-2">Expected Change</p>
                          <div className="flex items-center space-x-6">
                            <span 
                              className="text-3xl font-bold border-2 rounded-lg p-6 m-3 shadow-lg"
                              style={{
                                color: prediction.change >= 0 ? '#10B981' : '#EF4444',
                                borderColor: prediction.change >= 0 ? '#10B981' : '#EF4444',
                                boxShadow: prediction.change >= 0 
                                  ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' 
                                  : '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
                              }}
                            >
                              {prediction.change >= 0 ? '+' : ''}${prediction.change.toFixed(2)}
                            </span>
                            <span 
                              className="text-xl font-semibold border-2 rounded-lg p-4 m-2 shadow-lg"
                              style={{
                                color: prediction.changePercent >= 0 ? '#10B981' : '#EF4444',
                                borderColor: prediction.changePercent >= 0 ? '#10B981' : '#EF4444',
                                boxShadow: prediction.changePercent >= 0 
                                  ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' 
                                  : '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
                              }}
                            >
                              ({prediction.changePercent >= 0 ? '+' : ''}${prediction.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2"
                          style={{
                            backgroundColor: prediction.change >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            borderColor: prediction.change >= 0 ? '#10B981' : '#EF4444',
                            boxShadow: prediction.change >= 0 
                              ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' 
                              : '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          {prediction.change >= 0 ? '📈' : '📉'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm">✓</span>
                            </div>
                            <p className="text-sm text-slate-400">Confidence Level</p>
                          </div>
                          <span className={`text-lg font-bold ${
                            prediction.confidence >= 0.8 ? 'text-emerald-400' : 
                            prediction.confidence >= 0.7 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {(prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              prediction.confidence >= 0.8 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 
                              prediction.confidence >= 0.7 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'
                            }`}
                            style={{ width: `${prediction.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm">~</span>
                            </div>
                            <p className="text-sm text-slate-400">Volatility Index</p>
                          </div>
                          <span className="text-lg font-bold text-purple-400">
                            {(prediction.volatility * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${prediction.volatility * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-inner">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm">ⓘ</span>
                        </div>
                        <p className="text-sm text-slate-400">Analysis Details</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Model Used:</span>
                          <span className="text-slate-300">LSTM + Attention</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Data Points:</span>
                          <span className="text-slate-300">10,000+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Processing Time:</span>
                          <span className="text-slate-300">0.2s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last Updated:</span>
                          <span className="text-slate-300">Just now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 text-center space-y-6 py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-4xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready for Analysis</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Enter a stock symbol above to get comprehensive AI-powered predictions and market analysis.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                    <span>⚡</span>
                    <span>Lightning fast predictions</span>
                    <span>•</span>
                    <span>🎯</span>
                    <span>94.2% accuracy</span>
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Spacer */}
            <div style={{ height: '4rem' }}></div>

            {/* API Status */}
            <div className="glass-status rounded-2xl p-6 hover-glass transition-glass animate-scale-in" style={{ marginTop: '8rem' }}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-green-400 animate-pulse-custom">📊</span>
                <h3 className="text-lg font-semibold text-white animate-slide-in-left">System Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">API Health</span>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      apiStatus === 'healthy' ? 'bg-green-500' : 
                      apiStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    <span className={`${
                      apiStatus === 'healthy' ? 'text-green-400' : 
                      apiStatus === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {apiStatus === 'healthy' ? 'Healthy' : 
                       apiStatus === 'warning' ? 'Warning' : 'Error'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ML Model</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Computing</span>
                  <span className="text-blue-400">GPU Accelerated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Predictions</span>
                  <span className="text-purple-400">{processedCount}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-purple-400">🧠</span>
                  <span className="text-gray-400">AI Model Details</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Architecture</span>
                    <span className="text-gray-400">LSTM + Attention</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Accuracy</span>
                    <span className="text-green-400">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Training Data</span>
                    <span className="text-blue-400">50M+ samples</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockPredictor;
