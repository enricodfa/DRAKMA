'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Bot } from 'lucide-react'
import { useAIChat } from '@/store/ai-chat'
import { useTypingEffect } from './useTypingEffect'

function renderContent(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ color: '#C9A86A', fontWeight: 600 }}>
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function TypingDots() {
  return (
    <div className="flex gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{
            backgroundColor: '#9090A0',
            animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  )
}

export default function AIAssistant() {
  const { messages, isTyping, sendMessage } = useAIChat()
  const [input, setInput] = useState('')
  const [animatingId, setAnimatingId] = useState<string | null>(null)
  const prevLengthRef = useRef(messages.length)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Animate new AI messages after user sends one
  useEffect(() => {
    if (messages.length <= prevLengthRef.current) return
    const lastAi = [...messages].reverse().find((m) => m.role === 'ai')
    if (lastAi) setAnimatingId(lastAi.id)
    prevLengthRef.current = messages.length
  }, [messages])

  // Scroll chat container (not the page) to bottom
  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  const animatingContent =
    animatingId ? (messages.find((m) => m.id === animatingId)?.content ?? '') : ''

  const typedText = useTypingEffect(animatingContent, { startDelay: 800, charDelay: 18 })

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="rounded-xl flex flex-col overflow-hidden"
      style={{ backgroundColor: '#2A2A31', height: '100%' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: '#363640' }}
      >
        <span className="text-xs font-semibold" style={{ color: '#C9A86A' }}>
          ✦ Assistente IA
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: '#363640', color: '#9090A0' }}
        >
          BETA
        </span>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div
                  className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                  style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
                >
                  {msg.content}
                </div>
              </div>
            )
          }

          const isAnimating = msg.id === animatingId
          const displayed = isAnimating ? typedText : msg.content

          return (
            <div key={msg.id} className="flex items-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#363640' }}
              >
                <Bot size={12} style={{ color: '#C9A86A' }} />
              </div>
              <div
                className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                style={{ backgroundColor: '#363640', color: '#D0D0D8' }}
              >
                {displayed ? renderContent(displayed) : <span style={{ opacity: 0 }}>.</span>}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#363640' }}
            >
              <Bot size={12} style={{ color: '#C9A86A' }} />
            </div>
            <div className="px-3 py-2 rounded-xl" style={{ backgroundColor: '#363640' }}>
              <TypingDots />
            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: '#363640' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte algo..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-[#6B6B80]"
            style={{ color: '#D0D0D8' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-40 hover:opacity-80"
            style={{ backgroundColor: '#C9A86A' }}
          >
            <Send size={11} style={{ color: '#1B1B1F' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
