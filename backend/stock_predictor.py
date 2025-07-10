#!/usr/bin/env python3
"""
Stock Prediction Service for FastAPI
====================================

This module contains the stock data processor and model classes
adapted from the training script for use in the FastAPI application.
"""

import os
import warnings
import numpy as np
import pandas as pd
import yfinance as yf
import torch
import torch.nn as nn
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import ta
from datetime import datetime, timedelta
import pickle
import json
import logging

# Suppress warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StockDataProcessor:
    """Advanced stock data processor with feature engineering"""
    
    def __init__(self, symbols=None, start_date=None, end_date=None):
        self.symbols = symbols or []
        self.start_date = start_date
        self.end_date = end_date
        self.scaler = StandardScaler()
        self.price_scaler = MinMaxScaler()
        
    def fetch_single_stock_data(self, symbol, days=200):
        """Fetch recent data for a single stock"""
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            ticker = yf.Ticker(symbol)
            data = ticker.history(start=start_date, end=end_date)
            
            if len(data) < 100:  # Need at least 100 days to get 60+ after feature engineering
                logger.warning(f"Insufficient data for {symbol}, only {len(data)} days available")
                return None
                
            data['Symbol'] = symbol
            return data
            
        except Exception as e:
            logger.error(f"Error fetching data for {symbol}: {e}")
            return None
    
    def engineer_features(self, data):
        """Engineer advanced technical features"""
        logger.info("Engineering technical features...")
        
        if len(data) < 50:  # Skip if insufficient data for indicators
            return None
            
        # Basic price features
        data['Returns'] = data['Close'].pct_change()
        data['Log_Returns'] = np.log(data['Close'] / data['Close'].shift(1))
        data['High_Low_Ratio'] = data['High'] / data['Low']
        data['Open_Close_Ratio'] = data['Open'] / data['Close']
        
        # Volume features
        data['Volume_Change'] = data['Volume'].pct_change()
        data['Price_Volume'] = data['Close'] * data['Volume']
        
        # Technical indicators (use shorter windows to preserve data)
        # Moving averages
        data['SMA_5'] = ta.trend.sma_indicator(data['Close'], window=5)
        data['SMA_10'] = ta.trend.sma_indicator(data['Close'], window=10)
        data['SMA_20'] = ta.trend.sma_indicator(data['Close'], window=20)
        data['SMA_30'] = ta.trend.sma_indicator(data['Close'], window=30)  # Reduced from 50
        data['EMA_12'] = ta.trend.ema_indicator(data['Close'], window=12)
        data['EMA_26'] = ta.trend.ema_indicator(data['Close'], window=26)
        
        # MACD
        data['MACD'] = ta.trend.macd_diff(data['Close'])
        data['MACD_Signal'] = ta.trend.macd_signal(data['Close'])
        
        # RSI
        data['RSI'] = ta.momentum.rsi(data['Close'], window=14)
        
        # Bollinger Bands
        data['BB_High'] = ta.volatility.bollinger_hband(data['Close'])
        data['BB_Low'] = ta.volatility.bollinger_lband(data['Close'])
        data['BB_Width'] = data['BB_High'] - data['BB_Low']
        
        # Stochastic Oscillator
        data['Stoch_K'] = ta.momentum.stoch(data['High'], data['Low'], data['Close'])
        data['Stoch_D'] = ta.momentum.stoch_signal(data['High'], data['Low'], data['Close'])
        
        # Average True Range
        data['ATR'] = ta.volatility.average_true_range(data['High'], data['Low'], data['Close'])
        
        # Commodity Channel Index
        data['CCI'] = ta.trend.cci(data['High'], data['Low'], data['Close'])
        
        # Williams %R
        data['Williams_R'] = ta.momentum.williams_r(data['High'], data['Low'], data['Close'])
        
        # On-Balance Volume
        data['OBV'] = ta.volume.on_balance_volume(data['Close'], data['Volume'])
        
        # Price position within daily range
        data['Price_Position'] = (data['Close'] - data['Low']) / (data['High'] - data['Low'])
        
        # Volatility indicators
        data['Volatility_5'] = data['Returns'].rolling(window=5).std()
        data['Volatility_10'] = data['Returns'].rolling(window=10).std()
        data['Volatility_20'] = data['Returns'].rolling(window=20).std()
        
        # Momentum indicators
        data['Momentum_5'] = data['Close'] / data['Close'].shift(5)
        data['Momentum_10'] = data['Close'] / data['Close'].shift(10)
        data['Momentum_20'] = data['Close'] / data['Close'].shift(20)
        
        # Gap indicators
        data['Gap'] = (data['Open'] - data['Close'].shift(1)) / data['Close'].shift(1)
        
        # Time-based features
        data['Day_of_Week'] = data.index.dayofweek
        data['Month'] = data.index.month
        data['Quarter'] = data.index.quarter
        
        # Drop rows with NaN values
        data = data.dropna()
        
        logger.info(f"Feature engineering complete. Shape: {data.shape}")
        
        return data
    
    def prepare_single_prediction_sequence(self, data, sequence_length=60):
        """Prepare sequence for single prediction"""
        # Select feature columns (exclude non-numeric and target)
        feature_cols = [col for col in data.columns if col not in ['Symbol', 'Close']]
        
        # Extract features
        features = data[feature_cols].values
        
        # Use the last sequence_length rows for prediction
        if len(features) < sequence_length:
            raise ValueError(f"Not enough data for prediction. Need {sequence_length} days, got {len(features)}")
        
        # Get the last sequence
        sequence = features[-sequence_length:]
        
        return sequence, feature_cols


class StockLSTM(nn.Module):
    """Advanced LSTM model for stock price prediction"""
    
    def __init__(self, input_size, hidden_size=128, num_layers=3, dropout=0.2):
        super(StockLSTM, self).__init__()
        
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # LSTM layers
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=True
        )
        
        # Fully connected layers
        self.fc1 = nn.Linear(hidden_size * 2, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc3 = nn.Linear(hidden_size // 2, 1)
        
        # Dropout and normalization
        self.dropout = nn.Dropout(dropout)
        self.batch_norm1 = nn.BatchNorm1d(hidden_size)
        self.batch_norm2 = nn.BatchNorm1d(hidden_size // 2)
        
        # Activation
        self.relu = nn.ReLU()
        self.gelu = nn.GELU()
        
    def forward(self, x):
        batch_size = x.size(0)
        
        # LSTM forward pass
        lstm_out, _ = self.lstm(x)
        
        # Use the last output
        last_output = lstm_out[:, -1, :]
        
        # Fully connected layers
        out = self.dropout(last_output)
        out = self.fc1(out)
        out = self.batch_norm1(out)
        out = self.gelu(out)
        out = self.dropout(out)
        
        out = self.fc2(out)
        out = self.batch_norm2(out)
        out = self.relu(out)
        out = self.dropout(out)
        
        out = self.fc3(out)
        
        return out


class StockPredictor:
    """Main predictor class that loads model and makes predictions"""
    
    def __init__(self, model_path, preprocessing_path, config_path):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load configuration
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Load preprocessing objects
        with open(preprocessing_path, 'rb') as f:
            self.preprocessing_objects = pickle.load(f)
        
        self.feature_scaler = self.preprocessing_objects['feature_scaler']
        self.price_scaler = self.preprocessing_objects['price_scaler']
        
        # Initialize model
        self.model = StockLSTM(
            input_size=self.config['input_size'],
            hidden_size=self.config['hidden_size'],
            num_layers=self.config['num_layers'],
            dropout=self.config['dropout']
        ).to(self.device)
        
        # Load model weights
        checkpoint = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.eval()
        
        # Initialize data processor
        self.data_processor = StockDataProcessor()
        
        logger.info(f"Model loaded successfully on {self.device}")
    
    def predict_stock_price(self, symbol, days_ahead=1):
        """Predict stock price for given symbol"""
        try:
            # Fetch recent data (more days to account for feature engineering losses)
            data = self.data_processor.fetch_single_stock_data(symbol, days=200)
            if data is None:
                return {"error": f"Could not fetch data for {symbol}"}
            
            # Engineer features
            featured_data = self.data_processor.engineer_features(data)
            if featured_data is None:
                return {"error": f"Could not engineer features for {symbol}"}
            
            # Prepare sequence
            sequence, feature_cols = self.data_processor.prepare_single_prediction_sequence(
                featured_data, self.config['sequence_length']
            )
            
            # Scale features
            sequence_scaled = self.feature_scaler.transform(sequence)
            
            # Prepare tensor
            sequence_tensor = torch.FloatTensor(sequence_scaled).unsqueeze(0).to(self.device)
            
            # Make prediction
            with torch.no_grad():
                prediction = self.model(sequence_tensor)
                predicted_price = self.price_scaler.inverse_transform(
                    prediction.cpu().numpy().reshape(-1, 1)
                )[0, 0]
            
            # Get current price for comparison
            current_price = featured_data['Close'].iloc[-1]
            
            return {
                "symbol": symbol,
                "current_price": float(current_price),
                "predicted_price": float(predicted_price),
                "prediction_change": float(predicted_price - current_price),
                "prediction_change_percent": float((predicted_price - current_price) / current_price * 100),
                "prediction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "days_ahead": days_ahead
            }
            
        except Exception as e:
            logger.error(f"Error predicting price for {symbol}: {e}")
            return {"error": str(e)}
    
    def get_stock_info(self, symbol):
        """Get basic stock information"""
        try:
            data = self.data_processor.fetch_single_stock_data(symbol, days=200)
            if data is None:
                return {"error": f"Could not fetch data for {symbol}"}
            
            return {
                "symbol": symbol,
                "current_price": float(data['Close'].iloc[-1]),
                "volume": int(data['Volume'].iloc[-1]),
                "high_52w": float(data['High'].max()),
                "low_52w": float(data['Low'].min()),
                "data_points": len(data),
                "last_update": data.index[-1].strftime("%Y-%m-%d")
            }
            
        except Exception as e:
            logger.error(f"Error getting info for {symbol}: {e}")
            return {"error": str(e)}
