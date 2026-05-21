import { Wallet, TrendingUp, Star, ArrowUpDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Receita } from '@/lib/supabase/queries'

type Props = { receitas: Receita[] }

export default function ReceitasStatCards({ receitas }: Props) {
  const total = receitas.reduce((sum, r) => sum + r.amount, 0)
  const count = receitas.length
  const avg = count > 0 ? total / 3 : 0
  const max = receitas.reduce((m, r) => r.amount > m.amount ? r : m, receitas[0] ?? { amount: 0, name: '—' })

  const cards = [
    { label: 'Total de receitas', value: formatCurrency(total), sub: `${count} entradas`, icon: Wallet, iconColor: '#4B9B7A', highlight: false },
    { label: 'Média mensal', value: formatCurrency(avg), sub: 'Últimos 3 meses', icon: TrendingUp, iconColor: '#C9A86A', highlight: true },
    { label: 'Maior receita', value: formatCurrency(max?.amount ?? 0), sub: max?.name ?? '—', icon: Star, iconColor: '#6B6B80', highlight: false },
    { label: 'Entradas', value: String(count), sub: 'Este mês', icon: ArrowUpDown, iconColor: '#5B8DEF', highlight: false },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: '#16161E', border: card.highlight ? '1px solid rgba(201,168,106,0.3)' : '1px solid #2A2A38' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: card.highlight ? '#C9A86A' : '#9090A0' }}>{card.label}</span>
              <Icon size={14} style={{ color: card.iconColor }} />
            </div>
            <p className="text-xl font-bold tabular-nums" style={{ color: card.highlight ? '#C9A86A' : '#F0F0F5' }}>
              {card.value}
            </p>
            <p className="text-[11px] mt-1 truncate" style={{ color: '#6B6B80' }}>{card.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
