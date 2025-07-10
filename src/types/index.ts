// Export all types from individual files
export * from './stock';
export * from './api';
export * from './chart';

// Import types for use in interfaces
import { Stock, StockPrediction } from './stock';
import { ChartTimeRange } from './chart';

// Common utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  refreshInterval: number; // in seconds
  defaultTimeRange: ChartTimeRange;
  notifications: {
    priceAlerts: boolean;
    predictionUpdates: boolean;
    marketNews: boolean;
  };
}

// Filter and sorting options
export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  maxVolume?: number;
  sectors?: string[];
  exchanges?: string[];
  marketCap?: 'small' | 'medium' | 'large';
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Search and filter state
export interface SearchState {
  query: string;
  filters: FilterOptions;
  sort: SortOptions;
  results: Stock[];
  loading: boolean;
  error: string | null;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'stock_update' | 'prediction_update' | 'market_status' | 'error';
  data: any;
  timestamp: string;
}

export interface StockUpdateMessage extends WebSocketMessage {
  type: 'stock_update';
  data: Stock;
}

export interface PredictionUpdateMessage extends WebSocketMessage {
  type: 'prediction_update';
  data: StockPrediction;
}

export interface MarketStatusMessage extends WebSocketMessage {
  type: 'market_status';
  data: {
    isOpen: boolean;
    nextOpen?: string;
    nextClose?: string;
    timezone: string;
  };
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
}

// Constants
export const STOCK_EXCHANGES = ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX'] as const;
export const SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Consumer Discretionary',
  'Consumer Staples',
  'Energy',
  'Utilities',
  'Real Estate',
  'Materials',
  'Industrials',
  'Communication Services'
] as const;

export type StockExchange = typeof STOCK_EXCHANGES[number];
export type StockSector = typeof SECTORS[number];
