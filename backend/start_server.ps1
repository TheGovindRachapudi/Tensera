# FastAPI Stock Prediction Server Startup Script
Write-Host "Starting FastAPI Stock Prediction Server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
