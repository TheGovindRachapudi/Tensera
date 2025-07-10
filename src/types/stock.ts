// Basic stock data interface
export interface Stock {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high52Week?: number;
  low52Week?: number;
  lastUpdated?: string;
}

// Historical stock data point
export interface StockHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Stock prediction data
export interface StockPrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  confidence: number; // 0-1 scale
  timeframe: 'short' | 'medium' | 'long'; // e.g., 1 day, 1 week, 1 month
  predictionDate: string;
  factors: PredictionFactor[];
}

// Factors influencing the prediction
export interface PredictionFactor {
  name: string;
  weight: number; // 0-1 scale indicating importance
  value: number;
  description: string;
}

// Technical indicators
export interface TechnicalIndicators {
  symbol: string;
  rsi: number; // Relative Strength Index
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  movingAverages: {
    sma20: number; // 20-day Simple Moving Average
    sma50: number; // 50-day Simple Moving Average
    sma200: number; // 200-day Simple Moving Average
    ema12: number; // 12-day Exponential Moving Average
    ema26: number; // 26-day Exponential Moving Average
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  support: number;
  resistance: number;
}

// Market sentiment data
export interface MarketSentiment {
  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number; // -1 to 1 scale
  newsCount: number;
  socialMediaMentions: number;
  analystRating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  lastUpdated: string;
}
