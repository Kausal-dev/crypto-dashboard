# 🚀 Crypto Dashboard - Live Price Tracker

A premium, real-time cryptocurrency dashboard built with React and FastAPI. Features live price tracking, interactive charts, and a modern glassmorphism UI.

<blockquote class="imgur-embed-pub" lang="en" data-id="a/DRyA4NU" data-context="false" ><a href="//imgur.com/a/DRyA4NU"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

## ✨ Features

- **Live Price Tracking**: Real-time data for Bitcoin, Ethereum, and Solana via Binance API.
- **Interactive Charts**: Dynamic area charts with 5 time ranges (1H, 6H, 24H, 7D, 30D).
- **Real-Time Volume**: Displays actual 24-hour trading volume from live markets.
- **Theme System**: Beautiful Dark & Light modes with persistent preference.
- **Premium UI**: Glassmorphism design, animated gradients, and smooth transitions.
- **Auto-Refresh**: Data updates automatically every 10 seconds without page reload.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI library with hooks.
- **Vite**: Blazing fast build tool and dev server.
- **Recharts**: Composable charting library for React.
- **Axios**: Promise-based HTTP client.
- **CSS3**: Custom variables, flexbox/grid, and animations.

### Backend
- **FastAPI**: High-performance Python web framework.
- **Uvicorn**: ASGI server implementation.
- **HTTPX**: Async HTTP client for API requests.
- **Binance API**: Robust source for cryptocurrency market data.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the App

1. **Start Backend Server**
   ```bash
   # In backend directory
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend Dev Server**
   ```bash
   # In frontend directory
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## 🎨 Design System

The project uses a custom CSS variable system for easy theming:

- **Colors**: HSL-based palette for dynamic adjustments.
- **Typography**: Inter font family for clean readability.
- **Glassmorphism**: Reusable classes for frosted glass effects.
- **Animations**: Subtle micro-interactions and transitions.

## 🔌 API Integration

The backend acts as a proxy to the Binance API to avoid CORS issues and rate limiting on the client side.

- `GET /api/price/{coin_id}`: Fetches price history and volume.
  - Query Params: `range` (1h, 6h, 24h, 7d, 30d)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
