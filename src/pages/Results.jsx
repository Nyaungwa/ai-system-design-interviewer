import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiRefreshCw, FiHome } from 'react-icons/fi'
import { FaAmazon } from 'react-icons/fa'
import ScoreCard from '../components/ScoreCard'
import ThemeToggle from '../components/ThemeToggle'
import { saveSession } from '../services/dynamoService'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { scores, system, duration, incomplete } = location.state || {}
  const savedRef = useRef(false)

  useEffect(() => {
    if (!scores || savedRef.current || incomplete) return
    savedRef.current = true
    saveSession({
      systemDesigned: system,
      overallScore: scores.overallScore,
      duration,
      summary: scores.modelAnswer?.slice(0, 300) || '',
    }).catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!system) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border-header)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
            <FaAmazon className="text-black text-sm" />
          </div>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Interview Complete</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{system}</span>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-10">
        {incomplete && !scores ? (
          <div className="card p-8 text-center">
            <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Interview ended early — no score available.</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Complete at least 8 exchanges to receive a full evaluation.</p>
          </div>
        ) : (
          <ScoreCard scores={scores} />
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/interview', { state: { system } })}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <FiRefreshCw /> Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <FiHome /> New System
          </button>
        </div>
      </div>
    </div>
  )
}
