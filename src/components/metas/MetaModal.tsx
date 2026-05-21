'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Meta, MetaInput } from '@/lib/supabase/metas'

const ICONS = ['🎯', '🏖️', '🚗', '📱', '🏠', '📚', '💊', '🎮', '💰', '✈️', '🎓', '🏋️', '🛍️', '🎸', '🐾', '💍']

type Props = {
  meta?: Meta
  onClose: () => void
  onSave: (input: Omit<MetaInput, 'user_id'>) => Promise<unknown>
}

export default function MetaModal({ meta, onClose, onSave }: Props) {
  const [name, setName] = useState(meta?.name ?? '')
  const [icon, setIcon] = useState(meta?.icon ?? '🎯')
  const [target, setTarget] = useState(meta ? String(meta.target_amount) : '')
  const [current, setCurrent] = useState(meta ? String(meta.current_amount) : '0')
  const [deadline, setDeadline] = useState(meta?.deadline ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const parseCurrency = (v: string) => parseFloat(v.replace(',', '.')) || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Informe o nome da meta.'); return }
    const t = parseCurrency(target)
    if (!t || t <= 0) { setError('Valor alvo inválido.'); return }
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        icon,
        target_amount: t,
        current_amount: parseCurrency(current),
        deadline: deadline || null,
      })
      onClose()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full rounded-2xl flex flex-col"
        style={{ maxWidth: 480, backgroundColor: '#16161E', border: '1px solid #2A2A38', maxHeight: '90vh', overflow: 'hidden' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2A2A38' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>
            {meta ? 'Editar meta' : 'Nova meta'}
          </h2>
          <button onClick={onClose} style={{ color: '#6B6B80' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5 overflow-y-auto">
          {/* Icon picker */}
          <div>
            <label className="text-xs mb-2 block" style={{ color: '#9090A0' }}>Ícone</label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className="text-xl rounded-lg flex items-center justify-center transition-all"
                  style={{
                    height: 40,
                    backgroundColor: icon === ic ? 'rgba(201,168,106,0.15)' : '#0F0F15',
                    border: icon === ic ? '1px solid rgba(201,168,106,0.5)' : '1px solid #2A2A38',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9090A0' }}>Nome da meta</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Viagem para Europa"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#F0F0F5' }}
            />
          </div>

          {/* Target amount */}
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9090A0' }}>Valor alvo (R$)</label>
            <input
              value={target}
              onChange={e => setTarget(e.target.value.replace(/[^\d,]/g, ''))}
              placeholder="0,00"
              inputMode="decimal"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#F0F0F5' }}
            />
          </div>

          {/* Current amount */}
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9090A0' }}>Valor já guardado (R$)</label>
            <input
              value={current}
              onChange={e => setCurrent(e.target.value.replace(/[^\d,]/g, ''))}
              placeholder="0,00"
              inputMode="decimal"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#F0F0F5' }}
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9090A0' }}>Prazo (opcional)</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#F0F0F5', colorScheme: 'dark' }}
            />
          </div>

          {error && <p className="text-xs" style={{ color: '#E05C5C' }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-semibold mt-1 disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            {saving ? 'Salvando...' : meta ? 'Salvar alterações' : 'Criar meta'}
          </button>
        </form>
      </div>
    </div>
  )
}
