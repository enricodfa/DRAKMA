/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useTypingEffect } from '@/components/ai/useTypingEffect'

describe('useTypingEffect', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('returns empty string before start delay', () => {
    const { result } = renderHook(() => useTypingEffect('Olá'))
    expect(result.current).toBe('')
  })

  it('starts typing after start delay', () => {
    const { result } = renderHook(() => useTypingEffect('Olá', { startDelay: 800, charDelay: 18 }))
    act(() => { jest.advanceTimersByTime(820) })
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('reveals full text after all characters are typed', () => {
    const text = 'Oi'
    const { result } = renderHook(() => useTypingEffect(text, { startDelay: 100, charDelay: 10 }))
    act(() => { jest.advanceTimersByTime(100 + 10 * text.length + 50) })
    expect(result.current).toBe(text)
  })

  it('resets when text changes', () => {
    let text = 'Oi'
    const { result, rerender } = renderHook(() => useTypingEffect(text, { startDelay: 0, charDelay: 10 }))
    act(() => { jest.advanceTimersByTime(10 * text.length + 50) })
    expect(result.current).toBe('Oi')
    text = 'Novo texto'
    rerender()
    expect(result.current).toBe('')
  })
})
