import './CryptoCard.css'

export default function CryptoCard({ children, className = '' }) {
  return (
    <div className={`crypto-card glass-card ${className}`}>
      {children}
    </div>
  )
}
