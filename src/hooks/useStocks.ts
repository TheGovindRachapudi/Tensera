import { useState, useEffect } from 'react';
import { Stock } from '../types';
import { stockService } from '../services';

interface UseStocksReturn {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await stockService.getStocks();
      setStocks(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Fallback to mock data for development
      setStocks([
        { symbol: 'AAPL', price: 150.25, change: 2.50, changePercent: 1.69, volume: 1234567 },
        { symbol: 'GOOGL', price: 2750.80, change: -15.20, changePercent: -0.55, volume: 987654 },
        { symbol: 'MSFT', price: 305.15, change: 5.75, changePercent: 1.92, volume: 2345678 },
        { symbol: 'TSLA', price: 800.40, change: -12.30, changePercent: -1.51, volume: 3456789 },
        { symbol: 'AMZN', price: 3200.75, change: 45.25, changePercent: 1.43, volume: 1876543 },
        { symbol: 'NVDA', price: 220.50, change: -8.75, changePercent: -3.82, volume: 5432109 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { stocks, loading, error, refetch: fetchStocks } as UseStocksReturn;
};
