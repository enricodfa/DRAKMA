import { useAIChat } from '@/store/ai-chat'

describe('useAIChat store', () => {
  beforeEach(() => {
    useAIChat.setState({ messages: [], isTyping: false })
  })

  it('starts with isTyping false', () => {
    expect(useAIChat.getState().isTyping).toBe(false)
  })

  it('sendMessage adds user message immediately', () => {
    useAIChat.getState().sendMessage('teste')
    const { messages } = useAIChat.getState()
    expect(messages).toHaveLength(1)
    expect(messages[0].role).toBe('user')
    expect(messages[0].content).toBe('teste')
  })

  it('sendMessage sets isTyping to true while waiting', () => {
    jest.useFakeTimers()
    useAIChat.getState().sendMessage('teste')
    expect(useAIChat.getState().isTyping).toBe(true)
    jest.useRealTimers()
  })

  it('sendMessage adds AI response after 800ms delay', () => {
    jest.useFakeTimers()
    useAIChat.getState().sendMessage('saldo')
    jest.advanceTimersByTime(800)
    const { messages, isTyping } = useAIChat.getState()
    expect(messages).toHaveLength(2)
    expect(messages[1].role).toBe('ai')
    expect(isTyping).toBe(false)
    jest.useRealTimers()
  })
})
