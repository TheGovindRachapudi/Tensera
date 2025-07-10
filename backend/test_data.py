import yfinance as yf
from datetime import datetime, timedelta

# Test data fetching
end_date = datetime.now()
start_date = end_date - timedelta(days=100)

print('Testing data fetch for AAPL...')
ticker = yf.Ticker('AAPL')
data = ticker.history(start=start_date, end=end_date)
print(f'Data points fetched: {len(data)}')
if len(data) > 0:
    print(f'Date range: {data.index[0]} to {data.index[-1]}')
    print(f'Last close price: {data["Close"].iloc[-1]:.2f}')
else:
    print('No data fetched!')
