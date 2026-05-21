'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { RECEITAS_CATEGORIES, RECEITAS_METHODS, CATEGORY_ICON, METHOD_LABEL } from '@/lib/categories'
import type { ReceitaInput } from '@/lib/supabase/queries'

type Props = {
  onClose: () => void
  onAdd: (input: Omit<ReceitaInput, 'user_id'>) => Promise<unknown>
}

const inputStyle = {
  width: '100%',
  backgroundColor: '#0F0F15',
  border: '1px solid #2A2A38',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#D0D0D8',
  fontSize: 13,
  outline: 'none',
}

const labelStyle = { display: 'block', fontSize: 11, color: '#6B6B80', marginBottom: 6 }

export default function AdicionarReceitaModal({ onClose, onAdd }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: RECEITAS_CATEGORIES[0],
    date: today,
    method: 'pix',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Informe a descrição'); return }
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount < 0) { setError('Valor inválido'); return }
    setSaving(true)
    try {
      await onAdd({
        name: form.name.trim(),
        amount,
        category: form.category,
        date: form.date,
        method: form.method,
        icon: CATEGORY_ICON[form.category] ?? '💵',
      })
      onClose()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Adicionar receita" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label style={labelStyle}>Descrição</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ex: Bolsa de Estudos"
            style={inputStyle}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>Valor (R$)</label>
            <input
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0,00"
              style={inputStyle}
              inputMode="decimal"
            />
          </div>
          <div>
            <label style={labelStyle}>Data</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Categoria</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {RECEITAS_CATEGORIES.map(c => (
              <option key={c} value={c}>{CATEGORY_ICON[c]} {c}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Método</label>
          <select
            value={form.method}
            onChange={e => set('method', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {RECEITAS_METHODS.map(m => (
              <option key={m} value={m}>{METHOD_LABEL[m]}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs" style={{ color: '#E05C5C' }}>{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#1E1E28', color: '#9090A0', border: '1px solid #2A2A38' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            {saving ? 'Salvando...' : 'Salvar receita'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
