'use client'

import { useState } from 'react'
import { CalendarDays, ChevronDown, Plus } from 'lucide-react'
import { useReceitas } from '@/hooks/useReceitas'
import { useGastos } from '@/hooks/useGastos'
import ReceitasStatCards from '@/components/receitas/ReceitasStatCards'
import ReceitasLineChart from '@/components/receitas/ReceitasLineChart'
import ReceitasCategoryChart from '@/components/receitas/ReceitasCategoryChart'
import ReceitasTable from '@/components/receitas/ReceitasTable'
import ReceitasSummary from '@/components/receitas/ReceitasSummary'
import AdicionarReceitaModal from '@/components/receitas/AdicionarReceitaModal'

export default function ReceitasPage() {
  const { receitas, loading, add, remove } = useReceitas()
  const { gastos } = useGastos()
  const [showModal, setShowModal] = useState(false)

  const monthMap: Record<string, number> = {}
  receitas.forEach(r => {
    const d = new Date(r.date + 'T12:00:00')
    const key = d.toLocaleDateString('pt-BR', { month: 'short' })
    monthMap[key] = (monthMap[key] ?? 0) + r.amount
  })
  const monthlyData = Object.entries(monthMap).map(([month, value]) => ({ month, value }))
  const totalGastos = gastos.reduce((sum, g) => sum + g.amount, 0)

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <header className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#1E1E28' }}>
        <div>
          <h1 className="text-base font-semibold" style={{ color: '#F0F0F5' }}>Receitas</h1>
          <p className="text-xs" style={{ color: '#6B6B80' }}>Acompanhe todas as suas entradas de dinheiro.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', color: '#D0D0D8' }}>
            <CalendarDays size={13} style={{ color: '#9090A0' }} />
            {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            <ChevronDown size={12} style={{ color: '#6B6B80' }} />
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}>
            <Plus size={13} /> Adicionar receita
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 flex flex-col gap-5">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#6B6B80' }}>Carregando...</p>
          </div>
        ) : (
          <>
            <ReceitasStatCards receitas={receitas} />
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
              <ReceitasLineChart monthlyData={monthlyData} />
              <ReceitasCategoryChart receitas={receitas} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 min-w-0"><ReceitasTable receitas={receitas} onDelete={remove} /></div>
              <div className="flex-shrink-0" style={{ width: 280 }}><ReceitasSummary receitas={receitas} totalGastos={totalGastos} /></div>
            </div>
          </>
        )}
      </main>

      {showModal && <AdicionarReceitaModal onClose={() => setShowModal(false)} onAdd={add} />}
    </div>
  )
}
