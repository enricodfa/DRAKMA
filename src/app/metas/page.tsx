'use client'

import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { useMetas } from '@/hooks/useMetas'
import MetaCard from '@/components/metas/MetaCard'
import MetaModal from '@/components/metas/MetaModal'
import type { Meta } from '@/lib/supabase/metas'

export default function MetasPage() {
  const { metas, loading, add, update, remove } = useMetas()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Meta | null>(null)

  const totalAlvo = metas.reduce((s, m) => s + m.target_amount, 0)
  const totalGuardado = metas.reduce((s, m) => s + m.current_amount, 0)
  const concluidas = metas.filter(m => m.current_amount >= m.target_amount).length

  const openAdd = () => { setEditing(null); setShowModal(true) }
  const openEdit = (m: Meta) => { setEditing(m); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const handleSave = async (input: Parameters<typeof add>[0]) => {
    if (editing) {
      await update(editing.id, input)
    } else {
      await add(input)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 md:px-6 py-4 border-b flex-shrink-0 gap-3"
        style={{ borderColor: '#1E1E28' }}
      >
        <div className="min-w-0">
          <h1 className="text-base font-semibold" style={{ color: '#F0F0F5' }}>Metas</h1>
          <p className="text-xs hidden md:block" style={{ color: '#6B6B80' }}>Defina objetivos e acompanhe seu progresso.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: '#C9A86A', color: '#1B1B1F', whiteSpace: 'nowrap' }}
        >
          <Plus size={13} />
          <span className="hidden sm:inline">Nova meta</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6 flex flex-col gap-5">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#6B6B80' }}>Carregando...</p>
          </div>
        ) : (
          <>
            {/* Summary strip */}
            {metas.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total de metas', value: String(metas.length), color: '#F0F0F5' },
                  { label: 'Concluídas', value: String(concluidas), color: '#4B9B7A' },
                  { label: 'Guardado / Alvo', value: `${Math.round(totalAlvo > 0 ? (totalGuardado / totalAlvo) * 100 : 0)}%`, color: '#C9A86A' },
                ].map(c => (
                  <div key={c.label} className="rounded-xl p-4" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
                    <p className="text-xs mb-1" style={{ color: '#9090A0' }}>{c.label}</p>
                    <p className="text-xl font-bold tabular-nums" style={{ color: c.color }}>{c.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Cards grid */}
            {metas.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(201,168,106,0.08)', border: '1px solid rgba(201,168,106,0.15)' }}
                >
                  <Target size={28} style={{ color: '#C9A86A' }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>Nenhuma meta ainda</p>
                  <p className="text-xs mt-1" style={{ color: '#6B6B80' }}>Crie sua primeira meta financeira</p>
                </div>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
                >
                  <Plus size={15} />
                  Criar meta
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {metas.map(m => (
                  <MetaCard
                    key={m.id}
                    meta={m}
                    onEdit={() => openEdit(m)}
                    onDelete={() => remove(m.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showModal && (
        <MetaModal
          meta={editing ?? undefined}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
