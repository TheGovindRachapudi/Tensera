import { apiClient } from './api';
import {
  StockPrediction,
  BatchPredictionRequest,
  PredictionFactor,
} from '../types';

// Prediction service for stock prediction operations
export class PredictionService {
  // Get prediction for a single stock
  async getPrediction(
    symbol: string,
    timeframe: 'short' | 'medium' | 'long' = 'medium',
    includeFactors: boolean = true
  ): Promise<StockPrediction> {
    const response = await apiClient.get<StockPrediction>(
      `/predictions/${symbol}`,
      { timeframe, includeFactors }
    );
    return response.data;
  }

  // Get predictions for multiple stocks
  async getBatchPredictions(request: BatchPredictionRequest): Promise<StockPrediction[]> {
    const response = await apiClient.post<StockPrediction[]>('/predictions/batch', request);
    return response.data;
  }

  // Get all predictions for a timeframe
  async getPredictionsByTimeframe(
    timeframe: 'short' | 'medium' | 'long',
    limit: number = 50
  ): Promise<StockPrediction[]> {
    const response = await apiClient.get<StockPrediction[]>(
      `/predictions/timeframe/${timeframe}`,
      { limit }
    );
    return response.data;
  }

  // Get top predictions (highest confidence)
  async getTopPredictions(
    limit: number = 10,
    timeframe?: 'short' | 'medium' | 'long'
  ): Promise<StockPrediction[]> {
    const response = await apiClient.get<StockPrediction[]>(
      '/predictions/top',
      { limit, timeframe }
    );
    return response.data;
  }

  // Get predictions with highest potential returns
  async getTopReturns(
    limit: number = 10,
    timeframe?: 'short' | 'medium' | 'long'
  ): Promise<StockPrediction[]> {
    const response = await apiClient.get<StockPrediction[]>(
      '/predictions/returns',
      { limit, timeframe }
    );
    return response.data;
  }

  // Get prediction accuracy statistics
  async getPredictionAccuracy(
    symbol?: string,
    timeframe?: 'short' | 'medium' | 'long',
    period?: '1d' | '1w' | '1m' | '3m' | '6m' | '1y'
  ): Promise<{
    symbol?: string;
    timeframe?: string;
    period?: string;
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    avgConfidence: number;
    avgError: number;
    avgAbsoluteError: number;
    directionalAccuracy: number;
  }> {
    const response = await apiClient.get<{
      symbol?: string;
      timeframe?: string;
      period?: string;
      totalPredictions: number;
      correctPredictions: number;
      accuracy: number;
      avgConfidence: number;
      avgError: number;
      avgAbsoluteError: number;
      directionalAccuracy: number;
    }>('/predictions/accuracy', { symbol, timeframe, period });
    return response.data;
  }

  // Get prediction factors for analysis
  async getPredictionFactors(
    symbol: string,
    timeframe: 'short' | 'medium' | 'long' = 'medium'
  ): Promise<PredictionFactor[]> {
    const response = await apiClient.get<PredictionFactor[]>(
      `/predictions/${symbol}/factors`,
      { timeframe }
    );
    return response.data;
  }

  // Get model performance metrics
  async getModelPerformance(
    modelId?: string,
    timeframe?: 'short' | 'medium' | 'long'
  ): Promise<{
    modelId?: string;
    timeframe?: string;
    mae: number; // Mean Absolute Error
    mse: number; // Mean Squared Error
    rmse: number; // Root Mean Squared Error
    mape: number; // Mean Absolute Percentage Error
    r2Score: number; // R-squared Score
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalReturn: number;
    volatility: number;
    lastUpdated: string;
  }> {
    const response = await apiClient.get<{
      modelId?: string;
      timeframe?: string;
      mae: number;
      mse: number;
      rmse: number;
      mape: number;
      r2Score: number;
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
      sharpeRatio: number;
      maxDrawdown: number;
      totalReturn: number;
      volatility: number;
      lastUpdated: string;
    }>('/predictions/model/performance', { modelId, timeframe });
    return response.data;
  }

  // Get prediction history for a stock
  async getPredictionHistory(
    symbol: string,
    timeframe?: 'short' | 'medium' | 'long',
    limit: number = 100
  ): Promise<{
    symbol: string;
    predictions: Array<{
      predictionDate: string;
      targetDate: string;
      predictedPrice: number;
      actualPrice?: number;
      confidence: number;
      accuracy?: number;
      error?: number;
      timeframe: string;
    }>;
  }> {
    const response = await apiClient.get<{
      symbol: string;
      predictions: Array<{
        predictionDate: string;
        targetDate: string;
        predictedPrice: number;
        actualPrice?: number;
        confidence: number;
        accuracy?: number;
        error?: number;
        timeframe: string;
      }>;
    }>(`/predictions/${symbol}/history`, { timeframe, limit });
    return response.data;
  }

  // Get predictions by sector
  async getPredictionsBySector(
    sector: string,
    timeframe?: 'short' | 'medium' | 'long',
    limit: number = 20
  ): Promise<StockPrediction[]> {
    const response = await apiClient.get<StockPrediction[]>(
      `/predictions/sector/${sector}`,
      { timeframe, limit }
    );
    return response.data;
  }

  // Get market predictions summary
  async getMarketPredictionsSummary(
    timeframe?: 'short' | 'medium' | 'long'
  ): Promise<{
    timeframe?: string;
    totalPredictions: number;
    avgConfidence: number;
    bullishPredictions: number;
    bearishPredictions: number;
    neutralPredictions: number;
    topGainers: StockPrediction[];
    topLosers: StockPrediction[];
    highestConfidence: StockPrediction[];
    sectorBreakdown: Record<string, {
      count: number;
      avgConfidence: number;
      avgPredictedReturn: number;
    }>;
  }> {
    const response = await apiClient.get<{
      timeframe?: string;
      totalPredictions: number;
      avgConfidence: number;
      bullishPredictions: number;
      bearishPredictions: number;
      neutralPredictions: number;
      topGainers: StockPrediction[];
      topLosers: StockPrediction[];
      highestConfidence: StockPrediction[];
      sectorBreakdown: Record<string, {
        count: number;
        avgConfidence: number;
        avgPredictedReturn: number;
      }>;
    }>('/predictions/market/summary', { timeframe });
    return response.data;
  }

  // Request new prediction (trigger model run)
  async requestPrediction(
    symbol: string,
    timeframe: 'short' | 'medium' | 'long' = 'medium',
    forceUpdate: boolean = false
  ): Promise<{
    symbol: string;
    timeframe: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    estimatedTime?: number;
    jobId: string;
  }> {
    const response = await apiClient.post<{
      symbol: string;
      timeframe: string;
      status: 'queued' | 'processing' | 'completed' | 'failed';
      estimatedTime?: number;
      jobId: string;
    }>('/predictions/request', { symbol, timeframe, forceUpdate });
    return response.data;
  }

  // Get prediction job status
  async getPredictionJobStatus(jobId: string): Promise<{
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;
    estimatedTime?: number;
    result?: StockPrediction;
    error?: string;
  }> {
    const response = await apiClient.get<{
      jobId: string;
      status: 'queued' | 'processing' | 'completed' | 'failed';
      progress: number;
      estimatedTime?: number;
      result?: StockPrediction;
      error?: string;
    }>(`/predictions/job/${jobId}`);
    return response.data;
  }
}

// Create and export a singleton instance
export const predictionService = new PredictionService();
