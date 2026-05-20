import { Wallet, BarChart2, TrendingUp, ArrowDownUp } from 'lucide-react'
import { allExpenses } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

const total = allExpenses.reduce((s, e) => s + e.amount, 0)
const avgDaily = total / 31
const biggest = allExpenses.reduce((a, b) => (b.amount > a.amount ? b : a))

const cards = [
  {
    label: 'Total de gastos',
    value: formatCurrency(total),
    sub: <span style={{ color: '#4B9B7A', fontSize: 11 }}>▼ 12% em relação a Abril</span>,
    icon: Wallet,
    iconBg: 'rgba(201,168,106,0.15)',
    iconColor: '#C9A86A',
  },
  {
    label: 'Média diária',
    value: formatCurrency(avgDaily),
    sub: <span style={{ color: '#9090A0', fontSize: 11 }}>Baseado em 31 dias</span>,
    icon: BarChart2,
    iconBg: 'rgba(91,141,239,0.15)',
    iconColor: '#5B8DEF',
  },
  {
    label: 'Maior gasto',
    value: formatCurrency(biggest.amount),
    sub: <span style={{ color: '#9090A0', fontSize: 11 }}>{biggest.name} • {formatDate(biggest.date)}</span>,
    icon: TrendingUp,
    iconBg: 'rgba(224,92,92,0.15)',
    iconColor: '#E05C5C',
  },
  {
    label: 'Transações',
    value: String(allExpenses.length),
    sub: <span style={{ color: '#9090A0', fontSize: 11 }}>Neste mês</span>,
    icon: ArrowDownUp,
    iconBg: 'rgba(139,126,200,0.15)',
    iconColor: '#8B7EC8',
  },
]

export default function GastosStatCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
        <div
          key={label}
          className="rounded-xl p-4 flex items-start gap-4"
          style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={18} style={{ color: iconColor }} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[11px] font-medium mb-1" style={{ color: '#9090A0' }}>{label}</p>
            <p className="font-bold tabular-nums" style={{ fontSize: 22, letterSpacing: '-0.5px', color: '#F0F0F5' }}>
              {value}
            </p>
            <div className="mt-0.5">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
