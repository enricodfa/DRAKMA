'use client'

import { useState } from 'react'
import { Search, ChevronDown, Download, Pencil, Trash2 } from 'lucide-react'
import { allIncomes, incomeCategoryColors } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export default function ReceitasTable() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas categorias')
  const [method, setMethod] = useState('Todos os métodos')

  const filtered = allIncomes.filter((inc) => {
    const matchSearch = inc.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todas categorias' || inc.category === category
    const matchMethod = method === 'Todos os métodos' || inc.method === method.toLowerCase()
    return matchSearch && matchCat && matchMethod
  })

  const methodLabel: Record<string, string> = {
    pix: 'PIX',
    transferencia: 'Transferência',
    ted: 'TED',
    deposito: 'Depósito',
  }

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
    >
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2A2A38' }}>
        <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>Todas as receitas</p>
        <button
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: '#1E1E28', border: '1px solid #2A2A38', color: '#9090A0' }}
        >
          <Download size={12} />
          Exportar
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #2A2A38' }}>
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38' }}
        >
          <Search size={13} style={{ color: '#6B6B80' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar receita..."
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: '#D0D0D8' }}
          />
        </div>

        {(['Todas categorias', 'Bolsa de Estudos', 'Trabalho', 'Ajuda dos pais', 'Outros'] as const).length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}
          >
            {['Todas categorias', 'Bolsa de Estudos', 'Trabalho', 'Ajuda dos pais', 'Outros'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        )}

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}
        >
          {['Todos os métodos', 'PIX', 'Transferência', 'TED', 'Depósito'].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Column headers */}
      <div
        className="grid text-[11px] px-5 py-2"
        style={{
          gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.6fr',
          color: '#6B6B80',
          borderBottom: '1px solid #2A2A38',
        }}
      >
        <span>Descrição</span>
        <span>Categoria</span>
        <span className="flex items-center gap-1 cursor-pointer">Data <ChevronDown size={10} /></span>
        <span className="flex items-center gap-1 cursor-pointer">Valor <ChevronDown size={10} /></span>
        <span>Método</span>
        <span>Ações</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y" style={{ borderColor: '#1E1E28' }}>
        {filtered.map((inc) => {
          const colors = incomeCategoryColors[inc.category] ?? { text: '#9090A0', bg: 'rgba(144,144,160,0.12)' }
          return (
            <div
              key={inc.id}
              className="grid items-center px-5 py-3 text-xs"
              style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.6fr' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{inc.icon}</span>
                <span style={{ color: '#D0D0D8' }}>{inc.name}</span>
              </div>

              <span>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                  style={{ color: colors.text, backgroundColor: colors.bg }}
                >
                  {inc.category}
                </span>
              </span>

              <span style={{ color: '#9090A0' }}>
                {new Date(inc.date + 'T12:00:00').toLocaleDateString('pt-BR')}
              </span>

              <span className="font-semibold tabular-nums" style={{ color: '#C9A86A' }}>
                {formatCurrency(inc.amount)}
              </span>

              <span style={{ color: '#9090A0' }}>{methodLabel[inc.method]}</span>

              <div className="flex items-center gap-2">
                <button className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
                  <Pencil size={13} />
                </button>
                <button className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
                  <Trash2 size={13} />
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
        <button className="hover:opacity-70">← Anterior</button>
        <div className="flex items-center gap-1">
          <span
            className="w-6 h-6 flex items-center justify-center rounded text-xs font-semibold"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            1
          </span>
        </div>
        <button className="hover:opacity-70">Próximo →</button>
      </div>
    </div>
  )
}
