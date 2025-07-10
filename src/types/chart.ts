// Chart data point interface
export interface ChartDataPoint {
  x: number | string | Date;
  y: number;
  timestamp?: string;
}

// Candlestick chart data
export interface CandlestickData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Chart time range options
export type ChartTimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'MAX';

// Chart types
export type ChartType = 'line' | 'candlestick' | 'volume' | 'area';

// Chart configuration
export interface ChartConfig {
  type: ChartType;
  timeRange: ChartTimeRange;
  showVolume: boolean;
  showTechnicalIndicators: boolean;
  indicators: TechnicalIndicatorType[];
}

// Technical indicator types for charts
export type TechnicalIndicatorType = 
  | 'SMA20' 
  | 'SMA50' 
  | 'SMA200' 
  | 'EMA12' 
  | 'EMA26'
  | 'RSI' 
  | 'MACD' 
  | 'BollingerBands'
  | 'Support'
  | 'Resistance';

// Chart theme
export interface ChartTheme {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  upColor: string;
  downColor: string;
  volumeColor: string;
}

// Chart annotation (for marking predictions, events, etc.)
export interface ChartAnnotation {
  id: string;
  type: 'prediction' | 'event' | 'news' | 'earning';
  x: number | string | Date;
  y?: number;
  title: string;
  description?: string;
  color: string;
  icon?: string;
}

// Performance metrics for charts
export interface PerformanceMetrics {
  return1D: number;
  return1W: number;
  return1M: number;
  return3M: number;
  return6M: number;
  return1Y: number;
  returnYTD: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
}
