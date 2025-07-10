#!/usr/bin/env python3
"""
Comprehensive Stock Prediction Analysis
======================================

This script starts the server and analyzes multiple stock predictions.
"""

import requests
import json
import time
import subprocess
import sys
from datetime import datetime

BASE_URL = "http://localhost:8000"

def analyze_single_prediction(symbol):
    """Analyze a single stock prediction"""
    print(f"\n📈 ANALYZING {symbol}")
    print("=" * 40)
    
    try:
        # Make prediction request
        payload = {"symbol": symbol, "days_ahead": 1}
        response = requests.post(f"{BASE_URL}/predict", json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            current_price = data['current_price']
            predicted_price = data['predicted_price']
            change = data['prediction_change']
            change_percent = data['prediction_change_percent']
            
            print(f"💰 Current Price: ${current_price:.2f}")
            print(f"🔮 Predicted Price: ${predicted_price:.2f}")
            print(f"📊 Price Change: ${change:.2f}")
            print(f"📈 Percentage Change: {change_percent:.2f}%")
            
            # Analysis
            if change_percent > 2:
                print("🚀 STRONG BUY signal - significant upward prediction")
            elif change_percent > 0:
                print("📈 BUY signal - moderate upward prediction")
            elif change_percent > -2:
                print("➡️ HOLD signal - minimal price movement expected")
            else:
                print("📉 SELL signal - downward prediction")
            
            return {
                'symbol': symbol,
                'current_price': current_price,
                'predicted_price': predicted_price,
                'change': change,
                'change_percent': change_percent,
                'status': 'success'
            }
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return {'symbol': symbol, 'status': 'failed', 'error': response.text}
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return {'symbol': symbol, 'status': 'failed', 'error': str(e)}

def analyze_batch_predictions(symbols):
    """Analyze batch predictions"""
    print(f"\n🏢 BATCH PREDICTION ANALYSIS")
    print("=" * 50)
    
    try:
        payload = {"symbols": symbols, "days_ahead": 1}
        response = requests.post(f"{BASE_URL}/batch-predict", json=payload, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            predictions = data['predictions']
            
            print(f"📊 Total Symbols: {data['total_symbols']}")
            print(f"✅ Successful: {data['successful_predictions']}")
            print(f"❌ Failed: {data['failed_predictions']}")
            
            successful_predictions = []
            for pred in predictions:
                if 'error' not in pred:
                    successful_predictions.append(pred)
            
            # Sort by percentage change
            successful_predictions.sort(key=lambda x: x['prediction_change_percent'], reverse=True)
            
            print(f"\n🏆 TOP PERFORMERS (by predicted % change):")
            for i, pred in enumerate(successful_predictions[:5]):
                symbol = pred['symbol']
                change_percent = pred['prediction_change_percent']
                predicted_price = pred['predicted_price']
                print(f"  {i+1}. {symbol}: {change_percent:+.2f}% → ${predicted_price:.2f}")
            
            print(f"\n📉 BOTTOM PERFORMERS (by predicted % change):")
            for i, pred in enumerate(successful_predictions[-5:]):
                symbol = pred['symbol']
                change_percent = pred['prediction_change_percent']
                predicted_price = pred['predicted_price']
                print(f"  {i+1}. {symbol}: {change_percent:+.2f}% → ${predicted_price:.2f}")
            
            return successful_predictions
        else:
            print(f"❌ Batch prediction failed: {response.status_code} - {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Batch prediction exception: {e}")
        return []

def analyze_market_sentiment(predictions):
    """Analyze overall market sentiment from predictions"""
    print(f"\n🌍 MARKET SENTIMENT ANALYSIS")
    print("=" * 40)
    
    if not predictions:
        print("❌ No predictions available for analysis")
        return
    
    bullish = [p for p in predictions if p['prediction_change_percent'] > 1]
    bearish = [p for p in predictions if p['prediction_change_percent'] < -1]
    neutral = [p for p in predictions if -1 <= p['prediction_change_percent'] <= 1]
    
    total = len(predictions)
    bullish_pct = len(bullish) / total * 100
    bearish_pct = len(bearish) / total * 100
    neutral_pct = len(neutral) / total * 100
    
    print(f"🚀 Bullish Stocks: {len(bullish)} ({bullish_pct:.1f}%)")
    print(f"📉 Bearish Stocks: {len(bearish)} ({bearish_pct:.1f}%)")
    print(f"➡️ Neutral Stocks: {len(neutral)} ({neutral_pct:.1f}%)")
    
    avg_change = sum(p['prediction_change_percent'] for p in predictions) / total
    
    print(f"\n📊 Average Predicted Change: {avg_change:+.2f}%")
    
    if avg_change > 1:
        sentiment = "BULLISH 🚀"
    elif avg_change < -1:
        sentiment = "BEARISH 📉"
    else:
        sentiment = "NEUTRAL ➡️"
    
    print(f"🎯 Overall Market Sentiment: {sentiment}")

def main():
    """Main analysis function"""
    print("🚀 Starting Comprehensive Stock Prediction Analysis")
    print("=" * 60)
    print(f"📅 Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Wait for server to be ready
    print("\n⏳ Waiting for server to be ready...")
    time.sleep(3)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is ready!")
        else:
            print("❌ Server health check failed")
            return
    except:
        print("❌ Cannot connect to server")
        return
    
    # Individual stock analysis
    individual_symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
    individual_results = []
    
    for symbol in individual_symbols:
        result = analyze_single_prediction(symbol)
        individual_results.append(result)
        time.sleep(1)  # Small delay between requests
    
    # Batch analysis with more symbols
    batch_symbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'JPM', 'V', 'JNJ', 'WMT', 'PG', 'UNH', 'DIS', 'HD'
    ]
    
    batch_results = analyze_batch_predictions(batch_symbols)
    
    # Market sentiment analysis
    successful_individual = [r for r in individual_results if r.get('status') == 'success']
    all_successful = successful_individual + batch_results
    
    # Remove duplicates
    seen_symbols = set()
    unique_predictions = []
    for pred in all_successful:
        if pred['symbol'] not in seen_symbols:
            unique_predictions.append(pred)
            seen_symbols.add(pred['symbol'])
    
    analyze_market_sentiment(unique_predictions)
    
    print(f"\n🎉 Analysis Complete!")
    print(f"📊 Total Stocks Analyzed: {len(unique_predictions)}")
    print("=" * 60)

if __name__ == "__main__":
    main()
