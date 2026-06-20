import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { FaAmazon } from 'react-icons/fa'
import ChatInterface from '../components/ChatInterface'
import DiagramCanvas from '../components/DiagramCanvas'
import Timer from '../components/Timer'
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

  // Start interview automatically when page loads
  useEffect(() => {
    if (!system) { navigate('/'); return }
    startInterview().then(() => setStarted(true))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Track elapsed seconds for saving to DynamoDB
  useEffect(() => {
    if (!started) return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [started])

  // Auto-navigate to results when interview finishes
  useEffect(() => {
    if (isComplete && scores) {
      navigate('/results', {
        state: { scores, system, duration: elapsed },
      })
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
    <div className="flex flex-col h-screen bg-navy-900 overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
            <FaAmazon className="text-black text-sm" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">AI Interviewer</p>
            <p className="text-white/40 text-xs">{system}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Timer running={started && !isComplete} />
          <button
            onClick={handleEnd}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all"
          >
            <FiX /> End Interview
          </button>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left — chat */}
        <div className="w-[45%] flex flex-col border-r border-white/10 min-h-0">
          <ChatInterface
            messages={messages}
            isTyping={isTyping}
            onSend={handleSend}
            disabled={isTyping || isComplete || !started}
            inputValue={input}
            onInputChange={setInput}
          />
        </div>

        {/* Right — diagram */}
        <div className="flex-1 p-4 min-h-0">
          <div className="h-full">
            <DiagramCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
