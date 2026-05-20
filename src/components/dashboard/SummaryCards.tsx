'use client'

import { TrendingUp, TrendingDown, Wallet, CalendarCheck } from 'lucide-react'
import { financialSummary } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const cards = [
  {
    label: 'Receitas',
    value: financialSummary.receitas,
    color: '#C9A86A',
    iconBg: '#FFF8EE',
    icon: TrendingUp,
  },
  {
    label: 'Gastos',
    value: financialSummary.gastos,
    color: '#E05C5C',
    iconBg: '#FFF0F0',
    icon: TrendingDown,
  },
  {
    label: 'Saldo disponível',
    value: financialSummary.saldo,
    color: '#1B1B1F',
    iconBg: '#F0F4FF',
    icon: Wallet,
  },
  {
    label: 'Previsão para o mês',
    value: financialSummary.previsao,
    color: '#5B8DEF',
    iconBg: '#F0FFF8',
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
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.boxShadow =
              '0 4px 12px rgba(0,0,0,0.10)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.boxShadow =
              '0 1px 3px rgba(0,0,0,0.06)')
          }
        >
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={16} style={{ color }} strokeWidth={2} />
          </div>

          {/* Value */}
          <div>
            <p
              className="font-bold tabular-nums"
              style={{ fontSize: 22, letterSpacing: '-0.5px', color }}
            >
              {formatCurrency(value)}
            </p>
            <p
              className="text-[11px] font-medium mt-0.5"
              style={{ color: '#9090A0' }}
            >
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
