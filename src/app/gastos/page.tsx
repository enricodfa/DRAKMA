'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useGastos } from '@/hooks/useGastos'
import GastosStatCards from '@/components/gastos/GastosStatCards'
import GastosTable from '@/components/gastos/GastosTable'
import GastosRightPanel from '@/components/gastos/GastosRightPanel'
import AdicionarGastoModal from '@/components/gastos/AdicionarGastoModal'
import MonthPicker from '@/components/ui/MonthPicker'

export default function GastosPage() {
  const { gastos, loading, add, remove } = useGastos()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <header
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: '#1E1E28' }}
      >
        <div>
          <h1 className="text-base font-semibold" style={{ color: '#F0F0F5' }}>Gastos</h1>
          <p className="text-xs" style={{ color: '#6B6B80' }}>Acompanhe e gerencie todos os seus gastos.</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthPicker align="right" />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            <Plus size={13} />
            Adicionar gasto
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
            <GastosStatCards gastos={gastos} />
            <div className="flex gap-4 flex-1" style={{ minHeight: 0 }}>
              <div className="flex-1 min-w-0">
                <GastosTable gastos={gastos} onDelete={remove} />
              </div>
              <div className="flex-shrink-0" style={{ width: 320 }}>
                <GastosRightPanel gastos={gastos} />
              </div>
            </div>
          </>
        )}
      </main>

      {showModal && (
        <AdicionarGastoModal
          onClose={() => setShowModal(false)}
          onAdd={add}
        />
      )}
    </div>
  )
}
