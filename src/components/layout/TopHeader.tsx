'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MONTHS_FULL = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function TopHeader() {
  const now = new Date(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()))
  const [name, setName] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [open, setOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(now.getFullYear())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      const fullName = data.user?.user_metadata?.full_name ?? data.user?.email ?? ''
      setName(fullName.split(' ')[0])
    })
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (month: number) => {
    setSelectedMonth(month)
    setSelectedYear(pickerYear)
    setOpen(false)
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
      style={{ backgroundColor: '#0F0F15', borderColor: '#1E1E28' }}
    >
      <div>
        <h1 className="text-base font-semibold" style={{ color: '#F0F0F5' }}>
          Olá, {name}
        </h1>
        <p className="text-xs" style={{ color: '#6B6B80' }}>
          Aqui está o resumo das suas finanças
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Month/Year picker */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => { setPickerYear(selectedYear); setOpen(o => !o) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
            style={{ backgroundColor: '#16161E', borderColor: '#2A2A38', color: '#D0D0D8' }}
          >
            {MONTHS_FULL[selectedMonth]} {selectedYear}
            <ChevronDown size={12} style={{ color: '#6B6B80' }} />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl z-50 p-4"
              style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', width: 240 }}
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
                  onClick={() => setPickerYear(y => y + 1)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:opacity-70"
                  style={{ color: '#9090A0' }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-4 gap-1">
                {MONTHS.map((m, i) => {
                  const isSelected = i === selectedMonth && pickerYear === selectedYear
                  return (
                    <button
                      key={m}
                      onClick={() => select(i)}
                      className="py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: isSelected ? '#C9A86A' : 'transparent',
                        color: isSelected ? '#1B1B1F' : '#9090A0',
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '#2A2A38' }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center border"
          style={{ borderColor: '#2A2A38', color: '#6B6B80', backgroundColor: '#16161E' }}
        >
          <Bell size={15} />
        </button>
      </div>
    </header>
  )
}
