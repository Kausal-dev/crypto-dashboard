import './ThemeToggle.css'

export default function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            className="theme-toggle"
            onClick={onToggle}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <span className="theme-icon">☀️</span>
            ) : (
                <span className="theme-icon">🌙</span>
            )}
        </button>
    )
}
