#!/usr/bin/env python3
"""
Advanced LSTM Stock Price Prediction Training Script
====================================================

This script implements a comprehensive LSTM model for stock price prediction with:
- Multi-company data collection over extended periods
- Advanced feature engineering with technical indicators
- Robust data preprocessing and normalization
- Multi-layered LSTM architecture with dropout and regularization
- Early stopping and learning rate scheduling
- Model export for production use

Author: AI Assistant
Date: 2025-07-07
"""

import os
import warnings
import numpy as np
import pandas as pd
import yfinance as yf
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
import ta
from tqdm import tqdm
import pickle
import json
from datetime import datetime, timedelta
import logging

# Suppress warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StockDataProcessor:
    """Advanced stock data processor with feature engineering"""
    
    def __init__(self, symbols, start_date, end_date):
        self.symbols = symbols
        self.start_date = start_date
        self.end_date = end_date
        self.scaler = StandardScaler()
        self.price_scaler = MinMaxScaler()
        
    def fetch_data(self):
        """Fetch stock data for multiple companies"""
        logger.info(f"Fetching data for {len(self.symbols)} symbols from {self.start_date} to {self.end_date}")
        
        all_data = []
        for symbol in tqdm(self.symbols, desc="Downloading stock data"):
            try:
                ticker = yf.Ticker(symbol)
                data = ticker.history(start=self.start_date, end=self.end_date)
                
                if len(data) < 100:  # Skip if insufficient data
                    logger.warning(f"Insufficient data for {symbol}, skipping...")
                    continue
                    
                data['Symbol'] = symbol
                all_data.append(data)
                
            except Exception as e:
                logger.error(f"Error fetching data for {symbol}: {e}")
                continue
        
        if not all_data:
            raise ValueError("No data could be fetched for any symbols")
            
        # Combine all data
        combined_data = pd.concat(all_data, ignore_index=False)
        logger.info(f"Successfully fetched data for {len(all_data)} symbols")
        
        return combined_data
    
    def engineer_features(self, data):
        """Engineer advanced technical features"""
        logger.info("Engineering technical features...")
        
        features_data = []
        
        for symbol in data['Symbol'].unique():
            symbol_data = data[data['Symbol'] == symbol].copy()
            
            if len(symbol_data) < 50:  # Skip if insufficient data for indicators
                continue
                
            # Basic price features
            symbol_data['Returns'] = symbol_data['Close'].pct_change()
            symbol_data['Log_Returns'] = np.log(symbol_data['Close'] / symbol_data['Close'].shift(1))
            symbol_data['High_Low_Ratio'] = symbol_data['High'] / symbol_data['Low']
            symbol_data['Open_Close_Ratio'] = symbol_data['Open'] / symbol_data['Close']
            
            # Volume features
            symbol_data['Volume_Change'] = symbol_data['Volume'].pct_change()
            symbol_data['Price_Volume'] = symbol_data['Close'] * symbol_data['Volume']
            
            # Technical indicators
            # Moving averages
            symbol_data['SMA_5'] = ta.trend.sma_indicator(symbol_data['Close'], window=5)
            symbol_data['SMA_10'] = ta.trend.sma_indicator(symbol_data['Close'], window=10)
            symbol_data['SMA_20'] = ta.trend.sma_indicator(symbol_data['Close'], window=20)
            symbol_data['SMA_50'] = ta.trend.sma_indicator(symbol_data['Close'], window=50)
            symbol_data['EMA_12'] = ta.trend.ema_indicator(symbol_data['Close'], window=12)
            symbol_data['EMA_26'] = ta.trend.ema_indicator(symbol_data['Close'], window=26)
            
            # MACD
            symbol_data['MACD'] = ta.trend.macd_diff(symbol_data['Close'])
            symbol_data['MACD_Signal'] = ta.trend.macd_signal(symbol_data['Close'])
            
            # RSI
            symbol_data['RSI'] = ta.momentum.rsi(symbol_data['Close'], window=14)
            
            # Bollinger Bands
            symbol_data['BB_High'] = ta.volatility.bollinger_hband(symbol_data['Close'])
            symbol_data['BB_Low'] = ta.volatility.bollinger_lband(symbol_data['Close'])
            symbol_data['BB_Width'] = symbol_data['BB_High'] - symbol_data['BB_Low']
            
            # Stochastic Oscillator
            symbol_data['Stoch_K'] = ta.momentum.stoch(symbol_data['High'], symbol_data['Low'], symbol_data['Close'])
            symbol_data['Stoch_D'] = ta.momentum.stoch_signal(symbol_data['High'], symbol_data['Low'], symbol_data['Close'])
            
            # Average True Range
            symbol_data['ATR'] = ta.volatility.average_true_range(symbol_data['High'], symbol_data['Low'], symbol_data['Close'])
            
            # Commodity Channel Index
            symbol_data['CCI'] = ta.trend.cci(symbol_data['High'], symbol_data['Low'], symbol_data['Close'])
            
            # Williams %R
            symbol_data['Williams_R'] = ta.momentum.williams_r(symbol_data['High'], symbol_data['Low'], symbol_data['Close'])
            
            # On-Balance Volume
            symbol_data['OBV'] = ta.volume.on_balance_volume(symbol_data['Close'], symbol_data['Volume'])
            
            # Price position within daily range
            symbol_data['Price_Position'] = (symbol_data['Close'] - symbol_data['Low']) / (symbol_data['High'] - symbol_data['Low'])
            
            # Volatility indicators
            symbol_data['Volatility_5'] = symbol_data['Returns'].rolling(window=5).std()
            symbol_data['Volatility_10'] = symbol_data['Returns'].rolling(window=10).std()
            symbol_data['Volatility_20'] = symbol_data['Returns'].rolling(window=20).std()
            
            # Momentum indicators
            symbol_data['Momentum_5'] = symbol_data['Close'] / symbol_data['Close'].shift(5)
            symbol_data['Momentum_10'] = symbol_data['Close'] / symbol_data['Close'].shift(10)
            symbol_data['Momentum_20'] = symbol_data['Close'] / symbol_data['Close'].shift(20)
            
            # Gap indicators
            symbol_data['Gap'] = (symbol_data['Open'] - symbol_data['Close'].shift(1)) / symbol_data['Close'].shift(1)
            
            # Time-based features
            symbol_data['Day_of_Week'] = symbol_data.index.dayofweek
            symbol_data['Month'] = symbol_data.index.month
            symbol_data['Quarter'] = symbol_data.index.quarter
            
            features_data.append(symbol_data)
        
        if not features_data:
            raise ValueError("No valid data after feature engineering")
            
        combined_features = pd.concat(features_data, ignore_index=False)
        
        # Drop rows with NaN values
        combined_features = combined_features.dropna()
        
        logger.info(f"Feature engineering complete. Shape: {combined_features.shape}")
        
        return combined_features
    
    def prepare_sequences(self, data, sequence_length=60, target_col='Close'):
        """Prepare sequences for LSTM training"""
        logger.info(f"Preparing sequences with length {sequence_length}")
        
        # Select feature columns (exclude non-numeric and target)
        feature_cols = [col for col in data.columns if col not in ['Symbol', target_col]]
        
        # Prepare sequences for each symbol
        all_sequences = []
        all_targets = []
        
        for symbol in data['Symbol'].unique():
            symbol_data = data[data['Symbol'] == symbol].copy()
            
            if len(symbol_data) < sequence_length + 1:
                continue
            
            # Extract features and target
            features = symbol_data[feature_cols].values
            targets = symbol_data[target_col].values
            
            # Normalize features
            features_scaled = self.scaler.fit_transform(features)
            
            # Normalize target prices
            targets_scaled = self.price_scaler.fit_transform(targets.reshape(-1, 1)).flatten()
            
            # Create sequences
            for i in range(sequence_length, len(features_scaled)):
                sequence = features_scaled[i-sequence_length:i]
                target = targets_scaled[i]
                
                all_sequences.append(sequence)
                all_targets.append(target)
        
        logger.info(f"Created {len(all_sequences)} sequences")
        
        return np.array(all_sequences), np.array(all_targets)


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
        
        # No attention mechanism for faster training
        
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


class StockTrainer:
    """Training manager for the LSTM model"""
    
    def __init__(self, model, device):
        self.model = model
        self.device = device
        self.best_loss = float('inf')
        self.patience_counter = 0
        
    def train(self, train_loader, val_loader, num_epochs=200, learning_rate=0.001, 
              patience=20, save_path='stock_lstm_model.pth'):
        """Train the LSTM model with early stopping"""
        
        criterion = nn.MSELoss()
        optimizer = optim.AdamW(self.model.parameters(), lr=learning_rate, weight_decay=1e-4)
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', 
                                                        factor=0.5, patience=10)
        
        train_losses = []
        val_losses = []
        
        logger.info(f"Starting training for {num_epochs} epochs...")
        
        for epoch in range(num_epochs):
            # Training phase
            self.model.train()
            train_loss = 0.0
            
            for batch_idx, (data, target) in enumerate(train_loader):
                data, target = data.to(self.device), target.to(self.device)
                
                optimizer.zero_grad()
                output = self.model(data)
                loss = criterion(output.squeeze(), target)
                loss.backward()
                
                # Gradient clipping
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
                
                optimizer.step()
                train_loss += loss.item()
            
            # Validation phase
            self.model.eval()
            val_loss = 0.0
            
            with torch.no_grad():
                for data, target in val_loader:
                    data, target = data.to(self.device), target.to(self.device)
                    output = self.model(data)
                    val_loss += criterion(output.squeeze(), target).item()
            
            train_loss /= len(train_loader)
            val_loss /= len(val_loader)
            
            train_losses.append(train_loss)
            val_losses.append(val_loss)
            
            # Learning rate scheduling
            scheduler.step(val_loss)
            
            # Early stopping
            if val_loss < self.best_loss:
                self.best_loss = val_loss
                self.patience_counter = 0
                # Save best model
                torch.save({
                    'epoch': epoch,
                    'model_state_dict': self.model.state_dict(),
                    'optimizer_state_dict': optimizer.state_dict(),
                    'loss': val_loss,
                }, save_path)
                logger.info(f"Epoch {epoch+1}: New best model saved (val_loss: {val_loss:.6f})")
            else:
                self.patience_counter += 1
            
            if epoch % 10 == 0:
                logger.info(f"Epoch {epoch+1}/{num_epochs}: "
                           f"Train Loss: {train_loss:.6f}, Val Loss: {val_loss:.6f}")
            
            # Early stopping
            if self.patience_counter >= patience:
                logger.info(f"Early stopping triggered after {epoch+1} epochs")
                break
        
        logger.info("Training completed!")
        
        # Save final model if no better model was saved
        if self.patience_counter < patience:
            torch.save({
                'epoch': epoch,
                'model_state_dict': self.model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'loss': val_loss,
            }, save_path)
            logger.info(f"Final model saved at epoch {epoch+1} (val_loss: {val_loss:.6f})")
        
        return train_losses, val_losses


def main():
    """Main training function"""
    
    # Configuration
    SYMBOLS = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'JPM', 'V', 'JNJ', 'WMT', 'PG', 'UNH', 'DIS', 'HD', 'MA', 'BAC',
        'ADBE', 'CRM', 'PYPL', 'INTC', 'CMCSA', 'VZ', 'ABT', 'PFE', 'KO',
        'CSCO', 'XOM', 'TMO', 'ABBV', 'ACN', 'AVGO', 'TXN', 'COST', 'QCOM'
    ]
    
    START_DATE = '2018-01-01'
    END_DATE = '2024-12-31'
    SEQUENCE_LENGTH = 60
    BATCH_SIZE = 128
    HIDDEN_SIZE = 64
    NUM_LAYERS = 2
    DROPOUT = 0.2
    LEARNING_RATE = 0.001
    NUM_EPOCHS = 15
    PATIENCE = 8
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logger.info(f"Using device: {device}")
    
    # Set random seeds for reproducibility
    torch.manual_seed(42)
    np.random.seed(42)
    
    try:
        # Initialize data processor
        processor = StockDataProcessor(SYMBOLS, START_DATE, END_DATE)
        
        # Fetch and process data
        raw_data = processor.fetch_data()
        featured_data = processor.engineer_features(raw_data)
        
        # Prepare sequences
        X, y = processor.prepare_sequences(featured_data, SEQUENCE_LENGTH)
        
        logger.info(f"Dataset shape: X={X.shape}, y={y.shape}")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, shuffle=True
        )
        
        # Create data loaders
        train_dataset = TensorDataset(torch.FloatTensor(X_train), torch.FloatTensor(y_train))
        test_dataset = TensorDataset(torch.FloatTensor(X_test), torch.FloatTensor(y_test))
        
        train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
        test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)
        
        # Initialize model
        input_size = X.shape[2]
        model = StockLSTM(
            input_size=input_size,
            hidden_size=HIDDEN_SIZE,
            num_layers=NUM_LAYERS,
            dropout=DROPOUT
        ).to(device)
        
        logger.info(f"Model initialized with {sum(p.numel() for p in model.parameters())} parameters")
        
        # Initialize trainer
        trainer = StockTrainer(model, device)
        
        # Train model
        train_losses, val_losses = trainer.train(
            train_loader=train_loader,
            val_loader=test_loader,
            num_epochs=NUM_EPOCHS,
            learning_rate=LEARNING_RATE,
            patience=PATIENCE,
            save_path='stock_lstm_model.pth'
        )
        
        # Save preprocessing objects
        with open('preprocessing_objects.pkl', 'wb') as f:
            pickle.dump({
                'feature_scaler': processor.scaler,
                'price_scaler': processor.price_scaler,
                'symbols': SYMBOLS,
                'sequence_length': SEQUENCE_LENGTH
            }, f)
        
        # Save model configuration
        config = {
            'input_size': input_size,
            'hidden_size': HIDDEN_SIZE,
            'num_layers': NUM_LAYERS,
            'dropout': DROPOUT,
            'sequence_length': SEQUENCE_LENGTH,
            'symbols': SYMBOLS,
            'training_date': datetime.now().isoformat(),
            'total_samples': len(X),
            'feature_columns': len(X[0][0])
        }
        
        with open('model_config.json', 'w') as f:
            json.dump(config, f, indent=2)
        
        logger.info("Model training and export completed successfully!")
        logger.info(f"Files saved:")
        logger.info(f"  - Model: stock_lstm_model.pth")
        logger.info(f"  - Preprocessing: preprocessing_objects.pkl")
        logger.info(f"  - Configuration: model_config.json")
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise


if __name__ == "__main__":
    main()
