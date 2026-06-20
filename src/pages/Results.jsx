import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiRefreshCw, FiHome } from 'react-icons/fi'
import { FaAmazon } from 'react-icons/fa'
import ScoreCard from '../components/ScoreCard'
import { saveSession } from '../services/dynamoService'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { scores, system, duration, incomplete } = location.state || {}
  const savedRef = useRef(false)

  // Persist to DynamoDB once on mount
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
    <div className="min-h-screen bg-navy-900 pb-16">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
            <FaAmazon className="text-black text-sm" />
          </div>
          <span className="text-white font-semibold">Interview Complete</span>
        </div>
        <span className="text-white/40 text-sm">{system}</span>
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-10">
        {incomplete && !scores ? (
          <div className="card p-8 text-center">
            <p className="text-white/60 mb-2">Interview ended early — no score available.</p>
            <p className="text-white/30 text-sm">Complete at least 8 exchanges to receive a full evaluation.</p>
          </div>
        ) : (
          <ScoreCard scores={scores} />
        )}

        {/* CTA buttons */}
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
