import { useState, useRef, useCallback } from 'react'
import {
  streamInterviewResponse,
  extractComponents,
  parseScores,
  cleanResponseText,
} from '../services/claudeService'

export function useInterview(system, onComponent) {
  const [messages, setMessages] = useState([])       // { role, content, raw? }
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [scores, setScores] = useState(null)
  const historyRef = useRef([])                      // raw API message history

  const addMessage = useCallback((role, content) => {
    setMessages(prev => [...prev, { role, content, id: Date.now() }])
  }, [])

  /** Send the opening interviewer message for the chosen system */
  const startInterview = useCallback(async () => {
    const opening = { role: 'user', content: `I want to design: ${system}` }
    historyRef.current = [opening]

    setIsTyping(true)
    let accumulated = ''

    await streamInterviewResponse(historyRef.current, chunk => {
      accumulated += chunk
    })

    const components = extractComponents(accumulated)
    components.forEach(c => onComponent?.(c))

    const clean = cleanResponseText(accumulated)
    historyRef.current.push({ role: 'assistant', content: accumulated })
    addMessage('assistant', clean)
    setIsTyping(false)
  }, [system, onComponent, addMessage])

  /** Send a user message and get the AI response */
  const sendMessage = useCallback(async (userText) => {
    addMessage('user', userText)
    historyRef.current.push({ role: 'user', content: userText })

    setIsTyping(true)
    let accumulated = ''

    // Stream the response, updating a temp "streaming" message
    const streamId = Date.now()
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: streamId, streaming: true }])

    await streamInterviewResponse(historyRef.current, chunk => {
      accumulated += chunk
      setMessages(prev =>
        prev.map(m =>
          m.id === streamId
            ? { ...m, content: cleanResponseText(accumulated) }
            : m,
        ),
      )
    })

    // Detect components to add to the diagram
    extractComponents(accumulated).forEach(c => onComponent?.(c))

    // Check if the interview is done
    const scoreData = parseScores(accumulated)
    if (scoreData) {
      setScores(scoreData)
      setIsComplete(true)
    }

    historyRef.current.push({ role: 'assistant', content: accumulated })

    // Finalise the streaming message
    setMessages(prev =>
      prev.map(m =>
        m.id === streamId ? { ...m, streaming: false } : m,
      ),
    )
    setIsTyping(false)

    return scoreData
  }, [addMessage, onComponent])

  return { messages, isTyping, isComplete, scores, startInterview, sendMessage }
}
