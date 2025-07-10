# Tensera

A modern full-stack stock prediction application powered by LSTM deep learning models. Tensera provides real-time stock data, AI-powered predictions, and comprehensive market analysis tools.

## Features

- 🤖 **LSTM-powered predictions** - Advanced deep learning model for accurate stock price forecasting
- 📊 **Real-time stock data** - Live market data and comprehensive stock information
- 📈 **Interactive charts** - Dynamic visualizations and technical analysis
- 🔍 **Advanced search** - Smart stock filtering and discovery
- 📱 **Responsive design** - Optimized for desktop, tablet, and mobile
- 🌐 **WebSocket integration** - Real-time updates and live data streams
- 🚀 **RESTful API** - FastAPI backend with comprehensive endpoints
- 🐳 **Docker ready** - Containerized deployment for both frontend and backend

## Architecture

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Modern CSS3 with responsive design
- **Charts**: Custom visualization components
- **State Management**: React hooks and context
- **Build Tool**: Create React App

### Backend
- **API Framework**: FastAPI (Python)
- **Machine Learning**: PyTorch LSTM model
- **Data Source**: Yahoo Finance API
- **Features**: Technical indicators, real-time predictions
- **CORS**: Configured for cross-origin requests

## Getting Started

### Prerequisites

**Frontend:**
- Node.js (v18 or higher)
- npm or yarn

**Backend:**
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TheGovindRachapudi/Tensera.git
   cd Tensera
   ```

2. **Set up the Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up the Frontend:**
   ```bash
   cd ..
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   python main.py
   # or
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   Backend will be available at: http://localhost:8000

2. **Start the Frontend (in a new terminal):**
   ```bash
   npm start
   ```
   Frontend will be available at: http://localhost:3000

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Available Scripts

### Frontend
- `npm start` - Runs the React app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Backend
- `python main.py` - Starts the FastAPI server
- `uvicorn main:app --reload` - Starts with auto-reload for development

## Project Structure

```
Tensera/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI application entry point
│   ├── stock_predictor.py  # LSTM model and prediction logic
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend containerization
│   └── test_*.py          # Test files
├── training/               # Machine learning model training
│   ├── train_lstm_model.py # LSTM model training script
│   ├── model_config.json   # Model configuration and metadata
│   ├── stock_lstm_model.pth # Trained PyTorch model weights
│   └── preprocessing_objects.pkl # Trained preprocessing pipeline
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── StockDashboard/ # Main dashboard
│   │   ├── StockPredictor/ # Prediction interface
│   │   ├── MarketSummary/  # Market overview
│   │   └── ...             # Other components
│   ├── services/           # API integration services
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript definitions
│   └── App.tsx            # Main application component
├── public/                # Static assets
├── build/                 # Production build output
├── package.json          # Frontend dependencies
├── Dockerfile            # Frontend containerization
└── README.md            # Project documentation
```

## API Endpoints

The backend provides the following REST API endpoints:

### Stock Predictions
- `POST /predict` - Get stock price prediction for a single symbol
- `POST /batch-predict` - Get predictions for multiple stocks
- `POST /stock-info` - Get detailed stock information

### System Information
- `GET /` - API information and available endpoints
- `GET /health` - Health check and model status
- `GET /supported-symbols` - List of trained stock symbols
- `GET /model-info` - Detailed model configuration

### Example API Usage

```bash
# Get prediction for Apple stock
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"symbol": "AAPL", "days_ahead": 5}'

# Get stock information
curl -X POST "http://localhost:8000/stock-info" \
     -H "Content-Type: application/json" \
     -d '{"symbol": "MSFT"}'
```

## Model Training

The LSTM model is pre-trained on 36 major stock symbols with advanced technical indicators. You can retrain the model with your own data:

### Training Features
- **Data Sources**: 36 major stocks (AAPL, MSFT, GOOGL, etc.)
- **Technical Indicators**: 41 features including SMA, EMA, MACD, RSI, Bollinger Bands
- **Model Architecture**: 2-layer LSTM with 64 hidden units and dropout
- **Sequence Length**: 60 days of historical data
- **Training Samples**: 59,436 sequences

### Retrain the Model

```bash
cd training
python train_lstm_model.py
```

### Model Files
- `stock_lstm_model.pth` - Trained PyTorch model weights
- `model_config.json` - Model architecture and training metadata
- `preprocessing_objects.pkl` - Fitted scalers and preprocessors
- `train_lstm_model.py` - Complete training pipeline

### Training Process
1. **Data Collection**: Fetches historical data via Yahoo Finance
2. **Feature Engineering**: Creates 41 technical indicators
3. **Preprocessing**: Normalizes data and creates sequences
4. **Model Training**: Multi-layer LSTM with early stopping
5. **Model Export**: Saves trained model and preprocessing pipeline

## Deployment

### Frontend Deployment

**Option 1: Netlify**
- Build: `npm run build`
- Deploy: Drag and drop the `build` folder to Netlify

**Option 2: Vercel**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set output directory: `build`

**Option 3: GitHub Pages**
- Install: `npm install --save-dev gh-pages`
- Add to package.json scripts: `"deploy": "gh-pages -d build"`
- Deploy: `npm run deploy`

### Backend Deployment

**Option 1: Heroku**
```bash
# Create Procfile in backend/
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > backend/Procfile

# Deploy
heroku create tensera-backend
heroku buildpacks:set heroku/python
git subtree push --prefix backend heroku main
```

**Option 2: Railway/Render**
- Connect GitHub repository
- Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set Python version: 3.8+

**Option 3: Docker**
```bash
# Backend
cd backend
docker build -t tensera-backend .
docker run -p 8000:8000 tensera-backend

# Frontend
cd ..
docker build -t tensera-frontend .
docker run -p 3000:3000 tensera-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Govind Rachapudi - [@TheGovindRachapudi](https://github.com/TheGovindRachapudi)

Project Link: [https://github.com/TheGovindRachapudi/Tensera](https://github.com/TheGovindRachapudi/Tensera)
