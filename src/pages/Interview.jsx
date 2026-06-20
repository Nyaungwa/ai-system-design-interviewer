import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { FaAmazon } from 'react-icons/fa'
import ChatInterface from '../components/ChatInterface'
import DiagramCanvas from '../components/DiagramCanvas'
import Timer from '../components/Timer'
import ThemeToggle from '../components/ThemeToggle'
import { useInterview } from '../hooks/useInterview'
import { useDiagram } from '../hooks/useDiagram'

export default function Interview() {
  const location = useLocation()
  const navigate = useNavigate()
  const system = location.state?.system

  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const { nodes, edges, addComponent, onNodesChange } = useDiagram()

  const { messages, isTyping, isComplete, scores, startInterview, sendMessage } =
    useInterview(system, addComponent)

  useEffect(() => {
    if (!system) { navigate('/'); return }
    startInterview().then(() => setStarted(true))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!started) return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [started])

  useEffect(() => {
    if (isComplete && scores) {
      navigate('/results', { state: { scores, system, duration: elapsed } })
    }
  }, [isComplete, scores]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback(async (text) => {
    setInput('')
    await sendMessage(text)
  }, [sendMessage])

  function handleEnd() {
    navigate('/results', {
      state: { scores: scores || null, system, duration: elapsed, incomplete: true },
    })
  }

  if (!system) return null

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border-header)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
            <FaAmazon className="text-black text-sm" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>AI Interviewer</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{system}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Timer running={started && !isComplete} />
          <ThemeToggle />
          <button
            onClick={handleEnd}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-card)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <FiX /> End Interview
          </button>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left — chat */}
        <div
          className="w-[45%] flex flex-col min-h-0"
          style={{ borderRight: '1px solid var(--border-header)', backgroundColor: 'var(--bg-card)' }}
        >
          <ChatInterface
            messages={messages}
            isTyping={isTyping}
            onSend={handleSend}
            disabled={isTyping || isComplete || !started}
            inputValue={input}
            onInputChange={setInput}
          />
        </div>

        {/* Right — diagram (intentionally stays dark) */}
        <div className="flex-1 p-4 min-h-0">
          <div className="h-full">
            <DiagramCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
