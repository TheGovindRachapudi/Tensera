#!/usr/bin/env python3
"""
API Test Script
===============

This script tests the FastAPI stock prediction endpoints.
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api():
    """Test all API endpoints"""
    
    print("🚀 Testing FastAPI Stock Prediction Service")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Health check failed with status: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Test 2: Root endpoint
    print("\n2. Testing Root Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Root endpoint working!")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Root endpoint failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
    
    # Test 3: Supported symbols
    print("\n3. Testing Supported Symbols...")
    try:
        response = requests.get(f"{BASE_URL}/supported-symbols")
        if response.status_code == 200:
            print("✅ Supported symbols working!")
            data = response.json()
            print(f"Total symbols: {data['total_symbols']}")
            print(f"First 5 symbols: {data['symbols'][:5]}")
        else:
            print(f"❌ Supported symbols failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Supported symbols failed: {e}")
    
    # Test 4: Stock prediction
    print("\n4. Testing Stock Prediction...")
    try:
        payload = {
            "symbol": "AAPL",
            "days_ahead": 1
        }
        response = requests.post(f"{BASE_URL}/predict", json=payload)
        if response.status_code == 200:
            print("✅ Stock prediction working!")
            data = response.json()
            print(f"Symbol: {data['symbol']}")
            print(f"Current Price: ${data['current_price']:.2f}")
            print(f"Predicted Price: ${data['predicted_price']:.2f}")
            print(f"Change: ${data['prediction_change']:.2f} ({data['prediction_change_percent']:.2f}%)")
        else:
            print(f"❌ Stock prediction failed with status: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Stock prediction failed: {e}")
    
    # Test 5: Stock info
    print("\n5. Testing Stock Info...")
    try:
        payload = {"symbol": "MSFT"}
        response = requests.post(f"{BASE_URL}/stock-info", json=payload)
        if response.status_code == 200:
            print("✅ Stock info working!")
            data = response.json()
            print(f"Symbol: {data['symbol']}")
            print(f"Current Price: ${data['current_price']:.2f}")
            print(f"Volume: {data['volume']:,}")
            print(f"52W High: ${data['high_52w']:.2f}")
            print(f"52W Low: ${data['low_52w']:.2f}")
        else:
            print(f"❌ Stock info failed with status: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Stock info failed: {e}")
    
    # Test 6: Batch prediction
    print("\n6. Testing Batch Prediction...")
    try:
        payload = {
            "symbols": ["AAPL", "MSFT", "GOOGL"],
            "days_ahead": 1
        }
        response = requests.post(f"{BASE_URL}/batch-predict", json=payload)
        if response.status_code == 200:
            print("✅ Batch prediction working!")
            data = response.json()
            print(f"Total symbols: {data['total_symbols']}")
            print(f"Successful: {data['successful_predictions']}")
            print(f"Failed: {data['failed_predictions']}")
            
            # Show first prediction
            if data['predictions']:
                first_pred = data['predictions'][0]
                if 'error' not in first_pred:
                    print(f"First prediction - {first_pred['symbol']}: ${first_pred['predicted_price']:.2f}")
        else:
            print(f"❌ Batch prediction failed with status: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Batch prediction failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API Testing Complete!")

if __name__ == "__main__":
    # Wait a moment for server to be ready
    time.sleep(2)
    test_api()
