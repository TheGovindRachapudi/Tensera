import {
  WebSocketMessage,
  StockUpdateMessage,
  PredictionUpdateMessage,
  MarketStatusMessage,
  Stock,
  StockPrediction,
} from '../types';

// WebSocket service for real-time updates
export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(url: string = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws') {
    this.url = url;
  }

  // Connect to WebSocket
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.stopHeartbeat();
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
    this.listeners.clear();
  }

  // Send message to WebSocket
  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Subscribe to stock updates
  subscribeToStock(symbol: string, callback: (stock: Stock) => void): () => void {
    const eventType = `stock_update_${symbol}`;
    
    // Send subscription message
    this.send({
      type: 'subscribe',
      channel: 'stock_updates',
      symbol: symbol,
    });

    return this.addEventListener(eventType, callback);
  }

  // Subscribe to prediction updates
  subscribeToPrediction(
    symbol: string,
    callback: (prediction: StockPrediction) => void
  ): () => void {
    const eventType = `prediction_update_${symbol}`;
    
    // Send subscription message
    this.send({
      type: 'subscribe',
      channel: 'prediction_updates',
      symbol: symbol,
    });

    return this.addEventListener(eventType, callback);
  }

  // Subscribe to market status updates
  subscribeToMarketStatus(
    callback: (status: MarketStatusMessage['data']) => void
  ): () => void {
    // Send subscription message
    this.send({
      type: 'subscribe',
      channel: 'market_status',
    });

    return this.addEventListener('market_status', callback);
  }

  // Subscribe to all stock updates
  subscribeToAllStocks(callback: (stock: Stock) => void): () => void {
    // Send subscription message
    this.send({
      type: 'subscribe',
      channel: 'all_stocks',
    });

    return this.addEventListener('stock_update', callback);
  }

  // Subscribe to specific stock list
  subscribeToStockList(
    symbols: string[],
    callback: (stock: Stock) => void
  ): () => void {
    // Send subscription message
    this.send({
      type: 'subscribe',
      channel: 'stock_list',
      symbols: symbols,
    });

    return this.addEventListener('stock_update', callback);
  }

  // Unsubscribe from stock updates
  unsubscribeFromStock(symbol: string): void {
    this.send({
      type: 'unsubscribe',
      channel: 'stock_updates',
      symbol: symbol,
    });
  }

  // Unsubscribe from prediction updates
  unsubscribeFromPrediction(symbol: string): void {
    this.send({
      type: 'unsubscribe',
      channel: 'prediction_updates',
      symbol: symbol,
    });
  }

  // Unsubscribe from market status
  unsubscribeFromMarketStatus(): void {
    this.send({
      type: 'unsubscribe',
      channel: 'market_status',
    });
  }

  // Generic event listener
  private addEventListener(eventType: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'stock_update':
        const stockMessage = message as StockUpdateMessage;
        this.notifyListeners('stock_update', stockMessage.data);
        this.notifyListeners(`stock_update_${stockMessage.data.symbol}`, stockMessage.data);
        break;

      case 'prediction_update':
        const predictionMessage = message as PredictionUpdateMessage;
        this.notifyListeners('prediction_update', predictionMessage.data);
        this.notifyListeners(
          `prediction_update_${predictionMessage.data.symbol}`,
          predictionMessage.data
        );
        break;

      case 'market_status':
        const statusMessage = message as MarketStatusMessage;
        this.notifyListeners('market_status', statusMessage.data);
        break;

      case 'error':
        console.error('WebSocket error message:', message.data);
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  // Notify listeners
  private notifyListeners(eventType: string, data: any): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket callback:', error);
        }
      });
    }
  }

  // Handle reconnection
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Start heartbeat
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, 30000); // Send ping every 30 seconds
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Get connection status
  getConnectionStatus(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.ws) return 'closed';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'open';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'closed';
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Create and export a singleton instance
export const websocketService = new WebSocketService();
