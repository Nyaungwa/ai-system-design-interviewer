import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored) return stored === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  })

  // Sync class on mount and whenever dark changes
  useEffect(() => {
    applyTheme(dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  function toggle() {
    // Add transitioning class so every element gets a 300ms color transition
    const html = document.documentElement
    html.classList.add('transitioning')
    setDark(d => !d)
    window.setTimeout(() => html.classList.remove('transitioning'), 300)
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
