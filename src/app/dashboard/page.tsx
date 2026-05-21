'use client'

import TopHeader from '@/components/layout/TopHeader'
import SummaryCards from '@/components/dashboard/SummaryCards'
import BentoGrid from '@/components/dashboard/BentoGrid'
import { useGastos } from '@/hooks/useGastos'
import { useReceitas } from '@/hooks/useReceitas'

export default function DashboardPage() {
  const { gastos, loading: loadingGastos } = useGastos()
  const { receitas, loading: loadingReceitas } = useReceitas()

  const totalGastos = gastos.reduce((sum, g) => sum + g.amount, 0)
  const totalReceitas = receitas.reduce((sum, r) => sum + r.amount, 0)
  const saldo = totalReceitas - totalGastos
  const previsao = saldo > 0 ? saldo * 0.15 : 0

  const loading = loadingGastos || loadingReceitas

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <TopHeader />
      <main className="flex-1 overflow-auto flex flex-col gap-4" style={{ padding: '20px 24px' }}>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#6B6B80' }}>Carregando...</p>
          </div>
        ) : (
          <>
            <SummaryCards
              receitas={totalReceitas}
              gastos={totalGastos}
              saldo={saldo}
              previsao={previsao}
            />
            <BentoGrid gastos={gastos} />
          </>
        )}
      </main>
    </div>
  )
}
