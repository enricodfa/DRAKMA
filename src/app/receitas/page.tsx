import { CalendarDays, ChevronDown, Plus } from 'lucide-react'
import ReceitasStatCards from '@/components/receitas/ReceitasStatCards'
import ReceitasLineChart from '@/components/receitas/ReceitasLineChart'
import ReceitasCategoryChart from '@/components/receitas/ReceitasCategoryChart'
import ReceitasTable from '@/components/receitas/ReceitasTable'
import ReceitasSummary from '@/components/receitas/ReceitasSummary'

export default function ReceitasPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: '#1E1E28' }}
      >
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#F0F0F5' }}>Receitas</h1>
          <p className="text-xs" style={{ color: '#6B6B80' }}>Acompanhe todas as suas entradas de dinheiro.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', color: '#D0D0D8' }}
          >
            <CalendarDays size={13} style={{ color: '#9090A0' }} />
            Maio de 2024
            <ChevronDown size={12} style={{ color: '#6B6B80' }} />
          </button>

          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            <Plus size={13} />
            Adicionar receita
            <ChevronDown size={12} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 flex flex-col gap-5">
        <ReceitasStatCards />

        {/* Charts row */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          <ReceitasLineChart />
          <ReceitasCategoryChart />
        </div>

        {/* Table + Summary row */}
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <ReceitasTable />
          </div>
          <div className="flex-shrink-0" style={{ width: 280 }}>
            <ReceitasSummary />
          </div>
        </div>
      </main>
    </div>
  )
}
