import { create } from 'zustand'
import { findAIResponse } from '@/lib/mock-data'

export type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
}

type AIChatStore = {
  messages: Message[]
  isTyping: boolean
  sendMessage: (text: string) => void
}

export const useAIChat = create<AIChatStore>((set) => ({
  messages: [
    {
      id: 'init-user',
      role: 'user',
      content: 'Posso sair esse final de semana?',
    },
    {
      id: 'init-ai',
      role: 'ai',
      content:
        'Considerando seus gastos atuais, você tem **R$ 880,00** disponíveis. Se mantiver o ritmo, poderá gastar até **R$ 80,00** no fim de semana sem comprometer seu orçamento. Quer que eu simule para você?',
    },
  ],
  isTyping: false,
  sendMessage: (text) => {
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `user-${Date.now()}`, role: 'user', content: text },
      ],
      isTyping: true,
    }))
    setTimeout(() => {
      set((state) => ({
        messages: [
          ...state.messages,
          { id: `ai-${Date.now()}`, role: 'ai', content: findAIResponse(text) },
        ],
        isTyping: false,
      }))
    }, 800)
  },
}))
