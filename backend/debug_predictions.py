#!/usr/bin/env python3
"""
Debug Stock Prediction Failures
===============================

This script investigates why stock predictions are failing.
"""

import sys
import traceback
from stock_predictor import StockDataProcessor, StockPredictor

def debug_data_fetch(symbol):
    """Debug data fetching for a specific symbol"""
    print(f"\n🔍 Debugging data fetch for {symbol}...")
    
    processor = StockDataProcessor()
    
    # Test with different day ranges
    for days in [30, 60, 100, 150]:
        print(f"\n  📅 Trying {days} days...")
        try:
            data = processor.fetch_single_stock_data(symbol, days=days)
            if data is not None:
                print(f"    ✅ Success! Got {len(data)} data points")
                print(f"    📊 Date range: {data.index[0]} to {data.index[-1]}")
                print(f"    💰 Last price: ${data['Close'].iloc[-1]:.2f}")
                return data, days
            else:
                print(f"    ❌ Failed - insufficient data")
        except Exception as e:
            print(f"    ❌ Error: {e}")
    
    return None, 0

def debug_feature_engineering(data, symbol):
    """Debug feature engineering process"""
    print(f"\n🔧 Debugging feature engineering for {symbol}...")
    
    processor = StockDataProcessor()
    
    try:
        print(f"  📊 Input data shape: {data.shape}")
        featured_data = processor.engineer_features(data.copy())
        
        if featured_data is not None:
            print(f"  ✅ Success! Output shape: {featured_data.shape}")
            print(f"  📈 Features available: {list(featured_data.columns)}")
            return featured_data
        else:
            print(f"  ❌ Feature engineering returned None")
            return None
            
    except Exception as e:
        print(f"  ❌ Feature engineering error: {e}")
        traceback.print_exc()
        return None

def debug_sequence_preparation(featured_data, symbol):
    """Debug sequence preparation"""
    print(f"\n📋 Debugging sequence preparation for {symbol}...")
    
    processor = StockDataProcessor()
    
    try:
        sequence, feature_cols = processor.prepare_single_prediction_sequence(
            featured_data, sequence_length=60
        )
        print(f"  ✅ Success! Sequence shape: {sequence.shape}")
        print(f"  🔢 Number of features: {len(feature_cols)}")
        print(f"  📊 Feature columns: {feature_cols[:5]}...")  # Show first 5
        return sequence, feature_cols
        
    except Exception as e:
        print(f"  ❌ Sequence preparation error: {e}")
        return None, None

def debug_full_prediction_process():
    """Debug the full prediction process"""
    print("🚀 Starting full prediction debug process...")
    
    # Test symbols
    test_symbols = ['AAPL', 'MSFT', 'GOOGL']
    
    for symbol in test_symbols:
        print(f"\n{'='*60}")
        print(f"🔍 DEBUGGING SYMBOL: {symbol}")
        print('='*60)
        
        # Step 1: Data fetch
        data, days_used = debug_data_fetch(symbol)
        if data is None:
            print(f"❌ Cannot proceed with {symbol} - no data available")
            continue
        
        # Step 2: Feature engineering
        featured_data = debug_feature_engineering(data, symbol)
        if featured_data is None:
            print(f"❌ Cannot proceed with {symbol} - feature engineering failed")
            continue
        
        # Step 3: Sequence preparation
        sequence, feature_cols = debug_sequence_preparation(featured_data, symbol)
        if sequence is None:
            print(f"❌ Cannot proceed with {symbol} - sequence preparation failed")
            continue
        
        print(f"\n✅ {symbol} debugging complete - all steps successful!")
        print(f"   📊 Data points: {len(data)} -> {len(featured_data)} after feature engineering")
        print(f"   🎯 Ready for prediction with {sequence.shape} sequence")

def test_predictor_directly():
    """Test the predictor class directly"""
    print("\n🧪 Testing StockPredictor directly...")
    
    try:
        predictor = StockPredictor(
            "../training/stock_lstm_model.pth",
            "../training/preprocessing_objects.pkl",
            "../training/model_config.json"
        )
        
        print("✅ Predictor loaded successfully!")
        
        # Test prediction
        result = predictor.predict_stock_price("AAPL")
        if "error" in result:
            print(f"❌ Prediction failed: {result['error']}")
        else:
            print(f"✅ Prediction successful:")
            print(f"   💰 Current: ${result['current_price']:.2f}")
            print(f"   🔮 Predicted: ${result['predicted_price']:.2f}")
            print(f"   📈 Change: {result['prediction_change_percent']:.2f}%")
        
        # Test stock info
        info = predictor.get_stock_info("MSFT")
        if "error" in info:
            print(f"❌ Stock info failed: {info['error']}")
        else:
            print(f"✅ Stock info successful:")
            print(f"   💰 Price: ${info['current_price']:.2f}")
            print(f"   📊 Volume: {info['volume']:,}")
        
    except Exception as e:
        print(f"❌ Predictor test failed: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    debug_full_prediction_process()
    test_predictor_directly()
