import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

function CircularScore({ score, size = 120 }) {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circle-progress">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a2236" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-white/40 text-xs">/100</span>
      </div>
    </div>
  )
}

function ScoreBar({ label, score }) {
  const color = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/70">{label}</span>
        <span className="text-white font-medium">{score}</span>
      </div>
      <div className="h-2 bg-navy-600 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export default function ScoreCard({ scores }) {
  if (!scores) return null

  const breakdown = [
    { label: 'Requirements Gathering', value: scores.requirementsScore },
    { label: 'Scalability',            value: scores.scalabilityScore  },
    { label: 'Database Design',        value: scores.databaseScore     },
    { label: 'API Design',             value: scores.apiScore          },
    { label: 'Trade-off Discussion',   value: scores.tradeoffScore     },
  ]

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Overall score */}
      <div className="card p-8 flex flex-col items-center gap-4">
        <h2 className="text-white/60 text-sm font-medium tracking-wider uppercase">Overall Score</h2>
        <CircularScore score={scores.overallScore} size={140} />
      </div>

      {/* Breakdown */}
      <div className="card p-6 space-y-5">
        <h3 className="text-white font-semibold">Score Breakdown</h3>
        {breakdown.map(b => (
          <ScoreBar key={b.label} label={b.label} score={b.value} />
        ))}
      </div>

      {/* Strengths */}
      {scores.strengths?.length > 0 && (
        <div className="card p-6 border-green-500/20 bg-green-500/5">
          <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
            <FiCheckCircle /> What You Did Well
          </h3>
          <ul className="space-y-2">
            {scores.strengths.map((s, i) => (
              <li key={i} className="text-white/80 text-sm flex gap-2">
                <span className="text-green-400 mt-0.5">✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {scores.improvements?.length > 0 && (
        <div className="card p-6 border-red-500/20 bg-red-500/5">
          <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
            <FiAlertCircle /> What You Missed
          </h3>
          <ul className="space-y-2">
            {scores.improvements.map((s, i) => (
              <li key={i} className="text-white/80 text-sm flex gap-2">
                <span className="text-red-400 mt-0.5">✗</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Model answer */}
      {scores.modelAnswer && (
        <div className="card p-6 border-brand-orange/20 bg-brand-orange/5">
          <h3 className="text-brand-orange font-semibold mb-4">Model Answer</h3>
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{scores.modelAnswer}</p>
        </div>
      )}
    </div>
  )
}
