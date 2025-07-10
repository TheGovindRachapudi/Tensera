#!/usr/bin/env python3
"""
FastAPI Stock Prediction Service
===============================

This FastAPI application serves stock price predictions using the trained LSTM model.
It provides endpoints for making predictions and getting stock information.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import logging
from contextlib import asynccontextmanager

from stock_predictor import StockPredictor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global predictor instance
predictor = None

# File paths
MODEL_PATH = "../training/stock_lstm_model.pth"
PREPROCESSING_PATH = "../training/preprocessing_objects.pkl"
CONFIG_PATH = "../training/model_config.json"

# Pydantic models for request/response
class PredictionRequest(BaseModel):
    symbol: str
    days_ahead: Optional[int] = 1

class StockInfoRequest(BaseModel):
    symbol: str

class BatchPredictionRequest(BaseModel):
    symbols: List[str]
    days_ahead: Optional[int] = 1

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global predictor
    try:
        logger.info("Loading stock prediction model...")
        predictor = StockPredictor(MODEL_PATH, PREPROCESSING_PATH, CONFIG_PATH)
        logger.info("Model loaded successfully!")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise e
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Stock Prediction API",
    description="Advanced LSTM-based stock price prediction service",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Stock Prediction API",
        "version": "1.0.0",
        "description": "Advanced LSTM-based stock price prediction service",
        "endpoints": {
            "predict": "/predict - Make a single stock prediction",
            "batch_predict": "/batch-predict - Make multiple stock predictions",
            "stock_info": "/stock-info - Get basic stock information",
            "health": "/health - Health check endpoint",
            "supported_symbols": "/supported-symbols - Get list of supported symbols"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    global predictor
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "status": "healthy",
        "model_loaded": True,
        "device": str(predictor.device),
        "model_config": predictor.config
    }

@app.post("/predict")
async def predict_stock(request: PredictionRequest):
    """Make a stock price prediction"""
    global predictor
    
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        symbol = request.symbol.upper()
        result = predictor.predict_stock_price(symbol, request.days_ahead)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Prediction error for {request.symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-predict")
async def batch_predict_stocks(request: BatchPredictionRequest):
    """Make predictions for multiple stocks"""
    global predictor
    
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        results = []
        for symbol in request.symbols:
            symbol = symbol.upper()
            result = predictor.predict_stock_price(symbol, request.days_ahead)
            results.append(result)
        
        return {
            "predictions": results,
            "total_symbols": len(request.symbols),
            "successful_predictions": len([r for r in results if "error" not in r]),
            "failed_predictions": len([r for r in results if "error" in r])
        }
        
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stock-info")
async def get_stock_info(request: StockInfoRequest):
    """Get basic stock information"""
    global predictor
    
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        symbol = request.symbol.upper()
        result = predictor.get_stock_info(symbol)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Stock info error for {request.symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/supported-symbols")
async def get_supported_symbols():
    """Get list of symbols that were used for training"""
    global predictor
    
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "symbols": predictor.config["symbols"],
        "total_symbols": len(predictor.config["symbols"]),
        "note": "Model works best with these symbols but can predict any valid stock symbol"
    }

@app.get("/model-info")
async def get_model_info():
    """Get detailed model information"""
    global predictor
    
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_config": predictor.config,
        "device": str(predictor.device),
        "model_parameters": {
            "input_size": predictor.config["input_size"],
            "hidden_size": predictor.config["hidden_size"],
            "num_layers": predictor.config["num_layers"],
            "dropout": predictor.config["dropout"],
            "sequence_length": predictor.config["sequence_length"]
        },
        "training_info": {
            "training_date": predictor.config.get("training_date"),
            "total_samples": predictor.config.get("total_samples"),
            "feature_columns": predictor.config.get("feature_columns")
        }
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "message": "Please check the API documentation"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "message": "Please try again later"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
