import './TimeRangeSelector.css'

export default function TimeRangeSelector({ value, onChange }) {
    const ranges = [
        { value: '1h', label: '1H' },
        { value: '6h', label: '6H' },
        { value: '24h', label: '24H' },
        { value: '7d', label: '7D' },
        { value: '30d', label: '30D' }
    ]

    return (
        <div className="time-range-selector">
            {ranges.map(range => (
                <button
                    key={range.value}
                    className={`range-button ${value === range.value ? 'active' : ''}`}
                    onClick={() => onChange(range.value)}
                >
                    {range.label}
                </button>
            ))}
        </div>
    )
}
