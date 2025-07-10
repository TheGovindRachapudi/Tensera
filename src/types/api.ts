import { Stock, StockPrediction, StockHistoricalData, TechnicalIndicators, MarketSentiment } from './stock';

// Base API response structure
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// Error response structure
export interface ApiError {
  error: string;
  code: number;
  details?: string;
  timestamp: string;
}

// Pagination for list responses
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  success: boolean;
  message?: string;
  timestamp: string;
}

// Stock list response
export type StockListResponse = ApiResponse<Stock[]>;

// Individual stock response
export type StockResponse = ApiResponse<Stock>;

// Stock prediction response
export type StockPredictionResponse = ApiResponse<StockPrediction>;

// Multiple predictions response
export type StockPredictionsResponse = ApiResponse<StockPrediction[]>;

// Historical data response
export type StockHistoricalResponse = ApiResponse<StockHistoricalData[]>;

// Technical indicators response
export type TechnicalIndicatorsResponse = ApiResponse<TechnicalIndicators>;

// Market sentiment response
export type MarketSentimentResponse = ApiResponse<MarketSentiment>;

// Batch prediction request
export interface BatchPredictionRequest {
  symbols: string[];
  timeframe: 'short' | 'medium' | 'long';
  includeFactors?: boolean;
}

// Batch prediction response
export type BatchPredictionResponse = ApiResponse<StockPrediction[]>;

// Stock search request
export interface StockSearchRequest {
  query: string;
  limit?: number;
  includeInactive?: boolean;
}

// Stock search response
export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: 'stock' | 'etf' | 'index';
  isActive: boolean;
}

export type StockSearchResponse = ApiResponse<StockSearchResult[]>;

// Watchlist types
export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
  updatedAt: string;
}

export type WatchlistResponse = ApiResponse<Watchlist>;
export type WatchlistsResponse = ApiResponse<Watchlist[]>;

// Portfolio types
export interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  createdAt: string;
  updatedAt: string;
}

export type PortfolioResponse = ApiResponse<Portfolio>;
export type PortfoliosResponse = ApiResponse<Portfolio[]>;
