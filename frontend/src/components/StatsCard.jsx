import { useState, useEffect } from 'react'
import './StatsCard.css'

export default function StatsCard({ title, value, change, icon, isPrice = false }) {
    const [displayValue, setDisplayValue] = useState(value)
    const isPositive = change >= 0

    useEffect(() => {
        // Smooth number transition
        setDisplayValue(value)
    }, [value])

    const formatValue = (val) => {
        if (isPrice) {
            return `$${val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
        return val?.toLocaleString()
    }

    return (
        <div className="stats-card glass-card">
            <div className="stats-card-header">
                {icon && <span className="stats-icon">{icon}</span>}
                <span className="stats-title">{title}</span>
            </div>

            <div className="stats-value">
                {formatValue(displayValue)}
            </div>

            {change !== undefined && (
                <div className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
                    <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
                    <span>{Math.abs(change).toFixed(2)}%</span>
                    <span className="change-label">24h</span>
                </div>
            )}
        </div>
    )
}
