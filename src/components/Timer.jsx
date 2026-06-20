import { useState, useEffect, useRef } from 'react'
import { FiClock } from 'react-icons/fi'

export default function Timer({ running }) {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="flex items-center gap-2 text-white/60 text-sm font-mono">
      <FiClock className="text-brand-orange" />
      <span>{mm}:{ss}</span>
    </div>
  )
}
