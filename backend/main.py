from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import asyncio

# Create the FastAPI app
app = FastAPI(title="Crypto Dashboard API", version="2.0")

# CORS middleware - allows React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cryptocurrency ID mapping (Internal ID -> Binance Symbol)
COIN_MAPPING = {
    "bitcoin": "BTCUSDT",
    "ethereum": "ETHUSDT", 
    "solana": "SOLUSDT"
}

# Time range configurations
TIME_RANGES = {
    "1h": {"days": None, "hours": 1, "interval": "m5"},
    "6h": {"days": None, "hours": 6, "interval": "m15"},
    "24h": {"days": 1, "hours": None, "interval": "h1"},
    "7d": {"days": 7, "hours": None, "interval": "h4"},
    "30d": {"days": 30, "hours": None, "interval": "d1"}
}

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Crypto Dashboard API is running (Binance Only)",
        "endpoints": ["/api/price/{coin_id}"],
        "supported_ranges": list(TIME_RANGES.keys())
    }

@app.get("/api/price/{coin_id}")
async def get_price(
    coin_id: str,
    range: str = Query(default="24h", description="Time range: 1h, 6h, 24h, 7d, 30d")
):
    """
    Fetch real-time cryptocurrency price data with volume from Binance
    
    Args:
        coin_id: One of 'bitcoin', 'ethereum', or 'solana'
        range: Time range - 1h, 6h, 24h, 7d, or 30d
    
    Returns:
        JSON with historical price data and 24h volume for the specified range
    """
    
    # Validate coin ID
    if coin_id not in COIN_MAPPING:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid coin_id. Must be one of: {list(COIN_MAPPING.keys())}"
        )
    
    # Validate time range
    if range not in TIME_RANGES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid range. Must be one of: {list(TIME_RANGES.keys())}"
        )
    
    symbol = COIN_MAPPING[coin_id]
    range_config = TIME_RANGES[range]
    
    # Fetch from Binance
    try:
        result = await fetch_from_binance(coin_id, symbol, range, range_config)
        if result:
            return result
    except Exception as e:
        print(f"⚠️ Binance failed: {e}")
    
    # If Binance fails, raise an error
    print(f"❌ API failed for {coin_id} with range {range}")
    raise HTTPException(
        status_code=503,
        detail="Unable to fetch cryptocurrency data from Binance"
    )


async def fetch_from_binance(coin_id: str, symbol: str, range: str, config: Dict) -> Dict:
    """Fetch data from Binance public API"""
    print(f"🔄 Fetching from Binance for {coin_id} ({symbol}) - Range: {range}...")
    
    # Binance interval mapping
    binance_intervals = {
        "m5": "5m",
        "m15": "15m",
        "h1": "1h",
        "h4": "4h",
        "d1": "1d"
    }
    
    interval = binance_intervals.get(config["interval"], "1h")
    
    # Calculate limit based on time range
    if config["days"]:
        if config["days"] == 1:
            limit = 24
        elif config["days"] == 7:
            limit = 42
        else:  # 30 days
            limit = 30
    else:
        if config["hours"] == 1:
            limit = 12
        else:  # 6 hours
            limit = 24
    
    # Add a buffer to limit to ensure we cover the full range if needed, 
    # but Binance limits are strict on data points per interval.
    # The previous logic seemed to work, keeping it similar but ensuring we get enough data.
    
    url = "https://api.binance.com/api/v3/klines"
    params = {
        "symbol": symbol,
        "interval": interval,
        "limit": min(limit, 1000)
    }
    
    async with httpx.AsyncClient(timeout=20.0) as client:
        # Get historical klines
        response = await client.get(url, params=params)
        
        # Get 24h ticker for volume
        ticker_response = await client.get(
            "https://api.binance.com/api/v3/ticker/24hr",
            params={"symbol": symbol}
        )
    
    if response.status_code == 200 and ticker_response.status_code == 200:
        data = response.json()
        ticker_data = ticker_response.json()
        
        # Binance returns: [timestamp, open, high, low, close, volume, ...]
        history = [
            {
                "time": int(candle[0]),
                "price": round(float(candle[4]), 2)
            }
            for candle in data
        ]
        
        # Get 24h volume in USD (quoteVolume)
        volume_24h = float(ticker_data.get("quoteVolume", 0))
        
        if len(history) > 0:
            print(f"✅ Binance: Got {len(history)} data points for {coin_id} ({range})")
            return {
                "coin": coin_id,
                "range": range,
                "history": history,
                "volume_24h": volume_24h,
                "source": "binance",
                "data_points": len(history)
            }
    
    raise Exception(f"Binance returned status {response.status_code}")


# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)