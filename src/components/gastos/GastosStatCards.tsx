import { formatCurrency } from '@/lib/utils'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function GastosStatCards({ gastos }: Props) {
  const total = gastos.reduce((sum, g) => sum + g.amount, 0)
  const count = gastos.length
  const daily = count > 0 ? total / 30 : 0
  const max = gastos.reduce((m, g) => g.amount > m.amount ? g : m, gastos[0] ?? { amount: 0, name: '—' })

  const cards = [
    {
      label: 'Total de gastos',
      value: formatCurrency(total),
      sub: `${count} transações`,
      color: '#E05C5C',
    },
    {
      label: 'Média diária',
      value: formatCurrency(daily),
      sub: 'Últimos 30 dias',
      color: '#9090A0',
    },
    {
      label: 'Maior gasto',
      value: formatCurrency(max?.amount ?? 0),
      sub: max?.name ?? '—',
      color: '#F0F0F5',
    },
    {
      label: 'Transações',
      value: String(count),
      sub: 'Este mês',
      color: '#5B8DEF',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl p-4"
          style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
        >
          <p className="text-xs mb-2" style={{ color: '#9090A0' }}>{card.label}</p>
          <p className="text-xl font-bold tabular-nums" style={{ color: card.color }}>
            {card.value}
          </p>
          <p className="text-[11px] mt-1 truncate" style={{ color: '#6B6B80' }}>{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
