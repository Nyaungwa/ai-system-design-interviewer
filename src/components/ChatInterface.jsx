import { useEffect, useRef } from 'react'
import { FiSend } from 'react-icons/fi'
import { FaAmazon } from 'react-icons/fa'

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
        <FaAmazon className="text-black text-sm" />
      </div>
      <div className="bg-navy-600 rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="typing-dot w-2 h-2 bg-white/60 rounded-full block" />
          <span className="typing-dot w-2 h-2 bg-white/60 rounded-full block" />
          <span className="typing-dot w-2 h-2 bg-white/60 rounded-full block" />
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isAI = msg.role === 'assistant'
  return (
    <div className={`flex items-end gap-3 animate-fade-in ${isAI ? '' : 'flex-row-reverse'}`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
          <FaAmazon className="text-black text-sm" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isAI
            ? 'bg-navy-600 text-white rounded-bl-none'
            : 'bg-brand-orange text-black font-medium rounded-br-none'
          }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

export default function ChatInterface({ messages, isTyping, onSend, disabled, inputValue, onInputChange }) {
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      if (inputValue.trim()) onSend(inputValue.trim())
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your design approach..."
            disabled={disabled}
            className="input-field flex-1 resize-none text-sm leading-relaxed disabled:opacity-40"
          />
          <button
            onClick={() => { if (inputValue.trim()) onSend(inputValue.trim()) }}
            disabled={disabled || !inputValue.trim()}
            className="btn-primary h-12 w-12 flex items-center justify-center rounded-xl disabled:opacity-40 disabled:cursor-not-allowed p-0"
          >
            <FiSend className="text-lg" />
          </button>
        </div>
        <p className="text-white/25 text-xs mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
