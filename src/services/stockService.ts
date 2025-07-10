import { apiClient } from './api';
import {
  Stock,
  StockHistoricalData,
  TechnicalIndicators,
  MarketSentiment,
  StockSearchRequest,
  StockSearchResponse,
  StockSearchResult,
  ChartTimeRange,
} from '../types';

// Stock service for basic stock operations
export class StockService {
  // Get all stocks
  async getStocks(): Promise<Stock[]> {
    const response = await apiClient.get<Stock[]>('/stocks');
    return response.data;
  }

  // Get a specific stock by symbol
  async getStock(symbol: string): Promise<Stock> {
    const response = await apiClient.get<Stock>(`/stocks/${symbol}`);
    return response.data;
  }

  // Get multiple stocks by symbols
  async getStocksBySymbols(symbols: string[]): Promise<Stock[]> {
    const response = await apiClient.post<Stock[]>('/stocks/batch', { symbols });
    return response.data;
  }

  // Search for stocks
  async searchStocks(request: StockSearchRequest): Promise<StockSearchResponse> {
    const response = await apiClient.post<StockSearchResult[]>('/stocks/search', request);
    return response;
  }

  // Get historical data for a stock
  async getHistoricalData(
    symbol: string,
    timeRange: ChartTimeRange = '1M',
    interval: '1m' | '5m' | '15m' | '30m' | '1h' | '1d' | '1w' | '1M' = '1d'
  ): Promise<StockHistoricalData[]> {
    const response = await apiClient.get<StockHistoricalData[]>(
      `/stocks/${symbol}/historical`,
      { timeRange, interval }
    );
    return response.data;
  }

  // Get technical indicators for a stock
  async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicators> {
    const response = await apiClient.get<TechnicalIndicators>(`/stocks/${symbol}/indicators`);
    return response.data;
  }

  // Get market sentiment for a stock
  async getMarketSentiment(symbol: string): Promise<MarketSentiment> {
    const response = await apiClient.get<MarketSentiment>(`/stocks/${symbol}/sentiment`);
    return response.data;
  }

  // Get trending stocks
  async getTrendingStocks(limit: number = 10): Promise<Stock[]> {
    const response = await apiClient.get<Stock[]>('/stocks/trending', { limit });
    return response.data;
  }

  // Get top gainers
  async getTopGainers(limit: number = 10): Promise<Stock[]> {
    const response = await apiClient.get<Stock[]>('/stocks/gainers', { limit });
    return response.data;
  }

  // Get top losers
  async getTopLosers(limit: number = 10): Promise<Stock[]> {
    const response = await apiClient.get<Stock[]>('/stocks/losers', { limit });
    return response.data;
  }

  // Get most active stocks
  async getMostActive(limit: number = 10): Promise<Stock[]> {
    const response = await apiClient.get<Stock[]>('/stocks/active', { limit });
    return response.data;
  }

  // Get stocks by sector
  async getStocksBySector(sector: string): Promise<Stock[]> {
    const response = await apiClient.get<Stock[]>(`/stocks/sector/${sector}`);
    return response.data;
  }

  // Get stocks by exchange
  async getStocksByExchange(exchange: string): Promise<Stock[]> {
    const response = await apiClient.get<Stock[]>(`/stocks/exchange/${exchange}`);
    return response.data;
  }

  // Get market status
  async getMarketStatus(): Promise<{
    isOpen: boolean;
    nextOpen?: string;
    nextClose?: string;
    timezone: string;
  }> {
    const response = await apiClient.get<{
      isOpen: boolean;
      nextOpen?: string;
      nextClose?: string;
      timezone: string;
    }>('/market/status');
    return response.data;
  }

  // Get company information
  async getCompanyInfo(symbol: string): Promise<{
    symbol: string;
    name: string;
    description: string;
    sector: string;
    industry: string;
    website: string;
    employees: number;
    founded: string;
    headquarters: string;
    marketCap: number;
    peRatio: number;
    dividendYield: number;
    eps: number;
    beta: number;
  }> {
    const response = await apiClient.get<{
      symbol: string;
      name: string;
      description: string;
      sector: string;
      industry: string;
      website: string;
      employees: number;
      founded: string;
      headquarters: string;
      marketCap: number;
      peRatio: number;
      dividendYield: number;
      eps: number;
      beta: number;
    }>(`/stocks/${symbol}/company`);
    return response.data;
  }

  // Get financial data
  async getFinancialData(symbol: string): Promise<{
    symbol: string;
    revenue: number;
    netIncome: number;
    totalAssets: number;
    totalLiabilities: number;
    shareholdersEquity: number;
    operatingCashFlow: number;
    freeCashFlow: number;
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
    roe: number;
    roa: number;
    debtToEquity: number;
    currentRatio: number;
    quickRatio: number;
  }> {
    const response = await apiClient.get<{
      symbol: string;
      revenue: number;
      netIncome: number;
      totalAssets: number;
      totalLiabilities: number;
      shareholdersEquity: number;
      operatingCashFlow: number;
      freeCashFlow: number;
      grossMargin: number;
      operatingMargin: number;
      netMargin: number;
      roe: number;
      roa: number;
      debtToEquity: number;
      currentRatio: number;
      quickRatio: number;
    }>(`/stocks/${symbol}/financials`);
    return response.data;
  }
}

// Create and export a singleton instance
export const stockService = new StockService();
