import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SiX, SiNetflix, SiUber, SiWhatsapp, SiYoutube,
} from 'react-icons/si'
import { FaAmazon } from 'react-icons/fa'
import { FiLink, FiMessageSquare, FiArrowRight, FiClock, FiAward } from 'react-icons/fi'
import { MdOutlineDesignServices } from 'react-icons/md'
import SystemCard from '../components/SystemCard'
import ThemeToggle from '../components/ThemeToggle'
import { fetchRecentSessions } from '../services/dynamoService'

const PRESETS = [
  { id: 'twitter',  title: 'Design Twitter',        icon: SiX,               color: '#000000', iconBg: '#ffffff', description: 'Feed, follows, tweets, timeline' },
  { id: 'netflix',  title: 'Design Netflix',        icon: SiNetflix,         color: '#e50914', description: 'Video streaming, recommendations' },
  { id: 'uber',     title: 'Design Uber',           icon: SiUber,            color: '#000000', iconBg: '#ffffff', description: 'Real-time location, matching' },
  { id: 'whatsapp', title: 'Design WhatsApp',       icon: SiWhatsapp,        color: '#25d366', description: 'Messaging, presence, encryption' },
  { id: 'url',      title: 'Design URL Shortener',  icon: FiLink,            color: '#a78bfa', description: 'Hash generation, redirects, analytics' },
  { id: 'youtube',  title: 'Design YouTube',        icon: SiYoutube,         color: '#ff0000', description: 'Upload, transcode, streaming' },
  { id: 'amazon',   title: 'Design Amazon',         icon: FaAmazon,          color: '#ff9900', description: 'E-commerce, inventory, checkout' },
  { id: 'chat',     title: 'Design a Chat App',     icon: FiMessageSquare,   color: '#60a5fa', description: 'Real-time messaging, groups, push' },
]

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso)
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Landing() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [custom, setCustom] = useState('')
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentSessions()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  function handleStart() {
    const system = custom.trim() || selected
    if (!system) return
    navigate('/interview', { state: { system } })
  }

  const activeSystem = custom.trim() || selected

  return (
    <div className="min-h-screen">
      {/* Theme toggle — fixed top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        {/* Badge — explicitly themed for both modes */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400/25 dark:text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
          <MdOutlineDesignServices /> Powered by Claude AI
        </div>

        <h1 className="text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
          AI System Design<br />
          <span className="text-brand-blue">Interviewer</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Practice Amazon &amp; Google-style system design interviews with an AI that asks real follow-up questions and scores your answers.
        </p>
      </div>

      {/* System picker */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
          Choose a system to design
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {PRESETS.map(p => (
            <SystemCard
              key={p.id}
              title={p.title}
              icon={p.icon}
              color={p.color}
              iconBg={p.iconBg}
              description={p.description}
              selected={selected === p.title && !custom.trim()}
              onClick={() => { setSelected(p.title); setCustom('') }}
            />
          ))}
        </div>

        {/* Custom input */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Or type a custom system (e.g. Design Spotify)…"
            value={custom}
            onChange={e => { setCustom(e.target.value); setSelected(null) }}
            className="input-field flex-1"
          />
          <button
            onClick={handleStart}
            disabled={!activeSystem}
            className="btn-primary flex items-center gap-2 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Interview <FiArrowRight />
          </button>
        </div>

        {activeSystem && (
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Ready to design: <span className="text-brand-blue font-medium">{activeSystem}</span>
          </p>
        )}
      </div>

      {/* Recent sessions */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
          Recent Sessions
        </h2>

        {loading && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading sessions…</div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="card p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No sessions yet
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div className="grid gap-3">
            {sessions.map(s => (
              <div key={s.sessionId} className="card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center flex-shrink-0">
                  <FiAward className="text-brand-blue text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {s.systemDesigned}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <FiClock className="text-xs" /> {timeAgo(s.timestamp)}
                    {s.duration && ` · ${Math.floor(s.duration / 60)}m ${s.duration % 60}s`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-lg font-bold ${
                    s.overallScore >= 75 ? 'text-green-500 dark:text-green-400' :
                    s.overallScore >= 50 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'
                  }`}>
                    {s.overallScore}
                  </span>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>/100</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
