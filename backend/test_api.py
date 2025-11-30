import httpx
import asyncio

async def test_apis():
    """Test if we can reach cryptocurrency APIs"""
    
    print("Testing CoinCap API...")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get('https://api.coincap.io/v2/assets/bitcoin/history', 
                                   params={'interval': 'h1'})
            print(f"✅ CoinCap Status: {resp.status_code}")
            if resp.status_code == 200:
                data = resp.json()
                print(f"   Data points: {len(data.get('data', []))}")
    except Exception as e:
        print(f"❌ CoinCap Error: {e}")
    
    print("\nTesting Binance API...")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get('https://api.binance.com/api/v3/klines',
                                   params={'symbol': 'BTCUSDT', 'interval': '1h', 'limit': 24})
            print(f"✅ Binance Status: {resp.status_code}")
            if resp.status_code == 200:
                data = resp.json()
                print(f"   Data points: {len(data)}")
    except Exception as e:
        print(f"❌ Binance Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_apis())
