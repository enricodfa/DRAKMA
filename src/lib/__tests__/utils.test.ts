import { formatCurrency, formatDate, cn } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats a whole number as BRL', () => {
    const result = formatCurrency(1200)
    expect(result).toContain('1.200')
    expect(result).toContain('R$')
  })

  it('formats a decimal value as BRL', () => {
    const result = formatCurrency(35.5)
    expect(result).toContain('35,50')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })
})

describe('formatDate', () => {
  it('formats a date string in pt-BR', () => {
    const result = formatDate('2024-05-23')
    expect(result).toBe('23 de Maio')
  })

  it('formats another date correctly', () => {
    const result = formatDate('2024-05-22')
    expect(result).toBe('22 de Maio')
  })
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges Tailwind conflicts correctly', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
