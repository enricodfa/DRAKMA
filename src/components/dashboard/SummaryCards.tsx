'use client'

import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

type Props = {
  receitas: number
  gastos: number
  saldo: number
  previsao: number
}

export default function SummaryCards({ receitas, gastos, saldo, previsao }: Props) {
  const cards = [
    { label: 'Receitas', value: formatCurrency(receitas), icon: TrendingUp, color: '#C9A86A', iconBg: '#2A2212' },
    { label: 'Gastos', value: formatCurrency(gastos), icon: TrendingDown, color: '#E05C5C', iconBg: '#2A1212' },
    { label: 'Saldo disponível', value: formatCurrency(saldo), icon: Wallet, color: saldo >= 0 ? '#F0F0F5' : '#E05C5C', iconBg: '#1A1E2A' },
    { label: 'Previsão para o mês', value: formatCurrency(previsao), icon: Calendar, color: '#5B8DEF', iconBg: '#1A1E2A' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="rounded-xl p-4" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: card.iconBg }}>
              <Icon size={16} style={{ color: card.color }} />
            </div>
            <p className="text-xl font-bold tabular-nums" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs mt-1" style={{ color: '#9090A0' }}>{card.label}</p>
          </div>
        )
      })}
    </div>
  )
}
