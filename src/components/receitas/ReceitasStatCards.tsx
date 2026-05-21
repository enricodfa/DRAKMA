'use client'

import { Wallet, TrendingUp, ArrowUpDown, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const cards = [
  {
    label: 'Total de receitas',
    value: formatCurrency(1200),
    sub: '+8% em relação a Abril',
    subColor: '#4B9B7A',
    icon: Wallet,
    iconBg: '#1E2A22',
    iconColor: '#4B9B7A',
    highlight: false,
  },
  {
    label: 'Média mensal',
    value: formatCurrency(1150),
    sub: 'Baseado nos últimos 3 meses',
    subColor: '#9090A0',
    icon: TrendingUp,
    iconBg: '#2A2212',
    iconColor: '#C9A86A',
    highlight: true,
  },
  {
    label: 'Maior receita',
    value: formatCurrency(800),
    sub: 'Bolsa de Estudos • 01 Mai',
    subColor: '#9090A0',
    icon: Star,
    iconBg: '#1E2220',
    iconColor: '#6B6B80',
    highlight: false,
  },
  {
    label: 'Entradas',
    value: '4',
    sub: 'Neste mês',
    subColor: '#9090A0',
    icon: ArrowUpDown,
    iconBg: '#1A1E2A',
    iconColor: '#5B8DEF',
    highlight: false,
  },
]

export default function ReceitasStatCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{
              backgroundColor: '#16161E',
              border: card.highlight ? '1px solid rgba(201,168,106,0.3)' : '1px solid #2A2A38',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: card.highlight ? '#C9A86A' : '#9090A0' }}>
                {card.label}
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.iconBg }}
              >
                <Icon size={14} style={{ color: card.iconColor }} />
              </div>
            </div>
            <div>
              <p
                className="text-xl font-bold tabular-nums"
                style={{ color: card.highlight ? '#C9A86A' : '#F0F0F5' }}
              >
                {card.value}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: card.subColor }}>
                {card.sub}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
