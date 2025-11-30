import { useState, useEffect } from 'react'
import './PriceTicker.css'

export default function PriceTicker({ price, symbol = 'BTC' }) {
    const [prevPrice, setPrevPrice] = useState(price)
    const [priceChange, setPriceChange] = useState('neutral')

    useEffect(() => {
        if (price !== prevPrice) {
            setPriceChange(price > prevPrice ? 'up' : 'down')
            setPrevPrice(price)

            // Reset animation after 500ms
            const timer = setTimeout(() => {
                setPriceChange('neutral')
            }, 500)

            return () => clearTimeout(timer)
        }
    }, [price, prevPrice])

    return (
        <div className={`price-ticker ${priceChange}`}>
            <div className="price-ticker-label">{symbol} Price</div>
            <div className="price-ticker-value">
                ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
    )
}
