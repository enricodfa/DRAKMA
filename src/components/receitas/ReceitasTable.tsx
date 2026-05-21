'use client'

import { useState } from 'react'
import { Search, Download, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { incomeCategoryColors } from '@/lib/mock-data'
import { METHOD_LABEL } from '@/lib/categories'
import type { Receita } from '@/lib/supabase/queries'

type Props = {
  receitas: Receita[]
  onDelete: (id: string) => void
}

export default function ReceitasTable({ receitas, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas categorias')

  const categories = ['Todas categorias', ...Array.from(new Set(receitas.map(r => r.category)))]

  const filtered = receitas.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todas categorias' || r.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="rounded-xl flex flex-col" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2A2A38' }}>
        <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>Todas as receitas</p>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1E1E28', border: '1px solid #2A2A38', color: '#9090A0' }}>
          <Download size={12} /> Exportar
        </button>
      </div>

      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #2A2A38' }}>
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg" style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38' }}>
          <Search size={13} style={{ color: '#6B6B80' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar receita..."
            className="bg-transparent text-xs outline-none flex-1" style={{ color: '#D0D0D8' }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid text-[11px] px-5 py-2" style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr', color: '#6B6B80', borderBottom: '1px solid #2A2A38' }}>
        <span>Descrição</span><span>Categoria</span><span>Data</span><span>Valor</span><span>Método</span><span>Ações</span>
      </div>

      <div className="flex flex-col">
        {filtered.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: '#6B6B80' }}>
            {receitas.length === 0 ? 'Nenhuma receita ainda. Adicione a primeira!' : 'Nenhum resultado.'}
          </p>
        ) : filtered.map((r, i) => {
          const colors = incomeCategoryColors[r.category] ?? { text: '#9090A0', bg: 'rgba(144,144,160,0.12)' }
          return (
            <div key={r.id} className="grid items-center px-5 py-3 text-xs"
              style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr', borderTop: i > 0 ? '1px solid #1E1E28' : undefined }}>
              <div className="flex items-center gap-2">
                <span className="text-base">{r.icon}</span>
                <span style={{ color: '#D0D0D8' }}>{r.name}</span>
              </div>
              <span><span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ color: colors.text, backgroundColor: colors.bg }}>{r.category}</span></span>
              <span style={{ color: '#9090A0' }}>{new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
              <span className="font-semibold tabular-nums" style={{ color: '#C9A86A' }}>{formatCurrency(r.amount)}</span>
              <span style={{ color: '#9090A0' }}>{METHOD_LABEL[r.method] ?? r.method}</span>
              <button onClick={() => onDelete(r.id)} className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
                <Trash2 size={13} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
