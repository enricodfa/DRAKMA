'use client'

import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { categoryColors } from '@/lib/mock-data'
import { METHOD_LABEL } from '@/lib/categories'
import type { Gasto } from '@/lib/supabase/queries'

const PAGE_SIZE = 10

type Props = {
  gastos: Gasto[]
  onDelete: (id: string) => void
}

export default function GastosTable({ gastos, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [page, setPage] = useState(1)

  const categories = ['Todas', ...Array.from(new Set(gastos.map(g => g.category)))]

  const filtered = gastos.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todas' || g.category === category
    return matchSearch && matchCat
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="rounded-xl flex flex-col" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #2A2A38' }}>
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38' }}
        >
          <Search size={13} style={{ color: '#6B6B80' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar gasto..."
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: '#D0D0D8' }}
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="text-xs px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Column headers — desktop only */}
      <div
        className="hidden md:grid text-[11px] px-5 py-2"
        style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr', color: '#6B6B80', borderBottom: '1px solid #2A2A38' }}
      >
        <span>Descrição</span><span>Categoria</span><span>Data</span>
        <span>Valor</span><span>Método</span><span>Ações</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {paged.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: '#6B6B80' }}>
            {gastos.length === 0 ? 'Nenhum gasto ainda. Adicione seu primeiro!' : 'Nenhum resultado.'}
          </p>
        ) : paged.map((g, i) => {
          const colors = categoryColors[g.category] ?? { text: '#9090A0', bg: 'rgba(144,144,160,0.12)' }
          return (
            <div key={g.id} style={{ borderTop: i > 0 ? '1px solid #1E1E28' : undefined }}>
              {/* Desktop row */}
              <div
                className="hidden md:grid items-center px-5 py-3 text-xs"
                style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{g.icon}</span>
                  <span style={{ color: '#D0D0D8' }}>{g.name}</span>
                </div>
                <span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ color: colors.text, backgroundColor: colors.bg }}>
                    {g.category}
                  </span>
                </span>
                <span style={{ color: '#9090A0' }}>
                  {new Date(g.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                </span>
                <span className="font-semibold tabular-nums" style={{ color: '#E05C5C' }}>
                  -{formatCurrency(g.amount)}
                </span>
                <span style={{ color: '#9090A0' }}>{METHOD_LABEL[g.method] ?? g.method}</span>
                <button onClick={() => onDelete(g.id)} className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Mobile row */}
              <div className="flex md:hidden items-center px-4 py-3 gap-3">
                <span className="text-lg">{g.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#D0D0D8' }}>{g.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{ color: colors.text, backgroundColor: colors.bg }}>
                      {g.category}
                    </span>
                    <span className="text-[11px]" style={{ color: '#6B6B80' }}>
                      {new Date(g.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-sm tabular-nums" style={{ color: '#E05C5C' }}>
                  -{formatCurrency(g.amount)}
                </span>
                <button onClick={() => onDelete(g.id)} className="hover:opacity-70 transition-opacity ml-1" style={{ color: '#6B6B80' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-5 py-3 text-xs"
        style={{ borderTop: '1px solid #2A2A38', color: '#6B6B80' }}
      >
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="disabled:opacity-40 hover:opacity-70">
          ← Anterior
        </button>
        <span style={{ color: '#C9A86A' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="disabled:opacity-40 hover:opacity-70">
          Próximo →
        </button>
      </div>
    </div>
  )
}
