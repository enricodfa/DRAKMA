import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ReceitasSummary() {
  return (
    <div className="flex flex-col gap-4">
      {/* Resumo do mês */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: '#F0F0F5' }}>Resumo do mês</p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#9090A0' }}>Total de receitas</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: '#F0F0F5' }}>
              {formatCurrency(1200)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#9090A0' }}>Total de gastos</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: '#E05C5C' }}>
              {formatCurrency(320)}
            </span>
          </div>
          <div
            className="h-px w-full"
            style={{ backgroundColor: '#2A2A38' }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: '#D0D0D8' }}>Saldo do mês</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: '#4B9B7A' }}>
              {formatCurrency(880)}
            </span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">✨</span>
          <p className="text-xs font-semibold" style={{ color: '#C9A86A' }}>Insight do Drakma</p>
        </div>

        <div className="flex items-start gap-3">
          <p className="text-xs leading-relaxed flex-1" style={{ color: '#9090A0' }}>
            Suas receitas aumentaram{' '}
            <span className="font-semibold" style={{ color: '#C9A86A' }}>8%</span>{' '}
            em relação ao mês passado. Continue assim!
          </p>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#1E2A22' }}
          >
            <TrendingUp size={16} style={{ color: '#4B9B7A' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
