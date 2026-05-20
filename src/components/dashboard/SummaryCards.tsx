'use client'

import { TrendingUp, TrendingDown, Wallet, CalendarCheck } from 'lucide-react'
import { financialSummary } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const cards = [
  {
    label: 'Receitas',
    value: financialSummary.receitas,
    color: '#C9A86A',
    iconBg: 'rgba(201,168,106,0.15)',
    icon: TrendingUp,
  },
  {
    label: 'Gastos',
    value: financialSummary.gastos,
    color: '#E05C5C',
    iconBg: 'rgba(224,92,92,0.15)',
    icon: TrendingDown,
  },
  {
    label: 'Saldo disponível',
    value: financialSummary.saldo,
    color: '#F0F0F5',
    iconBg: 'rgba(91,141,239,0.15)',
    icon: Wallet,
  },
  {
    label: 'Previsão para o mês',
    value: financialSummary.previsao,
    color: '#5B8DEF',
    iconBg: 'rgba(75,155,122,0.15)',
    icon: CalendarCheck,
  },
]

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map(({ label, value, color, iconBg, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl p-4 flex flex-col gap-3 cursor-default transition-shadow"
          style={{
            backgroundColor: '#16161E',
            border: '1px solid #2A2A38',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = '#C9A86A30')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = '#2A2A38')
          }
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={16} style={{ color }} strokeWidth={2} />
          </div>

          <div>
            <p
              className="font-bold tabular-nums"
              style={{ fontSize: 22, letterSpacing: '-0.5px', color }}
            >
              {formatCurrency(value)}
            </p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: '#6B6B80' }}>
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
