'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePeriod } from '@/store/period'

const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MONTHS_FULL = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function getBrasiliaDate() {
  return new Date(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()))
}

type Props = {
  align?: 'left' | 'right'
}

export default function MonthPicker({ align = 'right' }: Props) {
  const { month, year, setPeriod } = usePeriod()
  const [open, setOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(year)
  const ref = useRef<HTMLDivElement>(null)

  const now = getBrasiliaDate()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (m: number) => {
    setPeriod(m, pickerYear)
    setOpen(false)
  }

  const isFuture = (m: number) =>
    pickerYear > currentYear || (pickerYear === currentYear && m > currentMonth)

  const canGoNextYear = pickerYear < currentYear

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setPickerYear(year); setOpen(o => !o) }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
        style={{ backgroundColor: '#16161E', borderColor: '#2A2A38', color: '#D0D0D8' }}
      >
        {MONTHS_FULL[month]} {year}
        <ChevronDown size={12} style={{ color: '#6B6B80' }} />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 rounded-xl z-50 p-4"
          style={{
            backgroundColor: '#16161E',
            border: '1px solid #2A2A38',
            width: 240,
            [align === 'right' ? 'right' : 'left']: 0,
          }}
        >
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setPickerYear(y => y - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:opacity-70"
              style={{ color: '#9090A0' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>{pickerYear}</span>
            <button
              onClick={() => canGoNextYear && setPickerYear(y => y + 1)}
              disabled={!canGoNextYear}
              className="w-6 h-6 flex items-center justify-center rounded-lg"
              style={{ color: canGoNextYear ? '#9090A0' : '#2A2A38', cursor: canGoNextYear ? 'pointer' : 'default' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-4 gap-1">
            {MONTHS_SHORT.map((m, i) => {
              const isSelected = i === month && pickerYear === year
              const future = isFuture(i)
              return (
                <button
                  key={m}
                  onClick={() => !future && select(i)}
                  disabled={future}
                  className="py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: isSelected ? '#C9A86A' : 'transparent',
                    color: isSelected ? '#1B1B1F' : future ? '#2A2A38' : '#9090A0',
                    cursor: future ? 'default' : 'pointer',
                  }}
                  onMouseEnter={e => { if (!isSelected && !future) (e.currentTarget as HTMLElement).style.backgroundColor = '#2A2A38' }}
                  onMouseLeave={e => { if (!isSelected && !future) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                >
                  {m}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
