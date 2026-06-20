import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center w-9 h-9 rounded-lg"
      style={{
        backgroundColor: 'var(--bg-raised)',
        border: '1px solid var(--border-card)',
        color: 'var(--text-secondary)',
      }}
    >
      {dark ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
    </button>
  )
}
