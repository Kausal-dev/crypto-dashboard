import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format } from 'date-fns'
import './App.css'
import CryptoCard from './components/CryptoCard'
import StatsCard from './components/StatsCard'
import PriceTicker from './components/PriceTicker'
import TimeRangeSelector from './components/TimeRangeSelector'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [data, setData] = useState([])
  const [coin, setCoin] = useState('bitcoin')
  const [timeRange, setTimeRange] = useState('24h')
  const [loading, setLoading] = useState(true)
  const [currentPrice, setCurrentPrice] = useState(null)
  const [priceChange, setPriceChange] = useState(0)
  const [volume, setVolume] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to dark
    return localStorage.getItem('theme') || 'dark'
  })

  const coinInfo = {
    bitcoin: { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    ethereum: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    solana: { name: 'Solana', symbol: 'SOL', icon: '◎' }
  }

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Apply theme on mount and theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Get chart colors based on theme
  const getChartColors = () => {
    if (theme === 'light') {
      return {
        grid: 'rgba(0, 0, 0, 0.1)',
        axis: 'rgba(0, 0, 0, 0.5)',
        text: '#333'
      }
    }
    return {
      grid: 'rgba(255, 255, 255, 0.1)',
      axis: 'rgba(255, 255, 255, 0.5)',
      text: '#fff'
    }
  }

  const chartColors = getChartColors()


  useEffect(() => {
    const fetchData = async () => {
      // Show update indicator (but not on first load)
      if (!loading) {
        setIsUpdating(true)
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/price/${coin}`, {
          params: { range: timeRange }
        })
        const history = response.data.history
        const volume24h = response.data.volume_24h || 0
        setData(history)

        // Calculate stats from data
        if (history && history.length > 0) {
          const latest = history[history.length - 1]
          const earliest = history[0]
          setCurrentPrice(latest.price)

          // Calculate change percentage for the selected range
          const change = ((latest.price - earliest.price) / earliest.price) * 100
          setPriceChange(change)

          // Use real 24-hour volume from API
          setVolume(volume24h)
        }

        // Update timestamp
        setLastUpdated(new Date())

      } catch (error) {
        console.error("Error fetching data", error)
      } finally {
        setLoading(false)
        // Hide update indicator after a short delay
        setTimeout(() => setIsUpdating(false), 800)
      }
    }

    fetchData()

    // Update every 10 seconds for real-time feel
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [coin, timeRange, loading])

  const formatTime = (tick) => {
    if (!tick) return ""
    const date = new Date(tick)

    // Format based on time range
    if (timeRange === '1h' || timeRange === '6h') {
      return format(date, 'HH:mm')  // Show time only
    } else if (timeRange === '24h') {
      return format(date, 'HH:mm')
    } else if (timeRange === '7d') {
      return format(date, 'MMM dd')  // Show date
    } else {  // 30d
      return format(date, 'MMM dd')
    }
  }

  const formatTooltipLabel = (label) => {
    if (!label) return ""
    const date = new Date(label)

    if (timeRange === '1h' || timeRange === '6h') {
      return format(date, 'PPp')  // Date and time
    } else {
      return format(date, 'PP pp')
    }
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return ""
    const now = new Date()
    const diff = Math.floor((now - lastUpdated) / 1000)

    if (diff < 10) return "Just now"
    if (diff < 60) return `${diff}s ago`
    const minutes = Math.floor(diff / 60)
    return `${minutes}m ago`
  }

  const getChangeLabel = () => {
    const labels = {
      '1h': '1H',
      '6h': '6H',
      '24h': '24H',
      '7d': '7D',
      '30d': '30D'
    }
    return labels[timeRange] || '24H'
  }

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-label">{formatTooltipLabel(label)}</div>
          <div className="tooltip-value">
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span>🚀</span>
            <span>Crypto Dashboard</span>
          </h1>

          <div className="header-controls">
            <div className="coin-selector">
              <label className="coin-selector-label" htmlFor="coin-select">
                Select Coin
              </label>
              <select
                id="coin-select"
                className="coin-select"
                onChange={(e) => setCoin(e.target.value)}
                value={coin}
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="solana">Solana (SOL)</option>
              </select>
            </div>

            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>

        {/* Price Ticker */}
        {!loading && currentPrice && (
          <CryptoCard>
            <PriceTicker price={currentPrice} symbol={coinInfo[coin].symbol} />

            {/* Live Status Indicator */}
            <div className="live-status">
              <div className={`live-indicator ${isUpdating ? 'updating' : ''}`}>
                <span className="live-dot"></span>
                <span className="live-text">LIVE</span>
              </div>
              <div className="last-update">
                Updated {formatLastUpdated()}
              </div>
            </div>
          </CryptoCard>
        )}
      </header>

      {/* Stats Grid */}
      {!loading && currentPrice && (
        <div className="stats-grid">
          <StatsCard
            title="Current Price"
            value={currentPrice}
            change={priceChange}
            icon="💰"
            isPrice={true}
          />
          <StatsCard
            title={`${getChangeLabel()} Change`}
            value={`${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`}
            icon={priceChange >= 0 ? '📈' : '📉'}
          />
          <StatsCard
            title="24H Volume"
            value={`$${(volume / 1000000000).toFixed(2)}B`}
            icon="📊"
          />
        </div>
      )}

      {/* Chart Section */}
      <section className="chart-section">
        <CryptoCard className="chart-card">
          {/* Time Range Selector */}
          <div className="chart-header">
            <h3 className="chart-title">Price Chart</h3>
            <TimeRangeSelector
              value={timeRange}
              onChange={setTimeRange}
            />
          </div>

          <div className="chart-container">
            {loading ? (
              <div className="chart-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading chart data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(250, 90%, 60%)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(250, 90%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatTime}
                    minTickGap={30}
                    stroke={chartColors.axis}
                    style={{ fontSize: '12px', fill: chartColors.text }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    stroke={chartColors.axis}
                    style={{ fontSize: '12px', fill: chartColors.text }}
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(250, 90%, 60%)"
                    strokeWidth={3}
                    fill="url(#colorPrice)"
                    animationDuration={1000}
                    isAnimationActive={!isUpdating}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CryptoCard>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <p className="footer-status">
          <span className="status-dot"></span>
          <span>Real-time data • Auto-updates every 10 seconds</span>
        </p>
      </footer>
    </div>
  )
}

export default App