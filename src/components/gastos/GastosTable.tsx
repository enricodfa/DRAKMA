'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, Upload, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { allExpenses, categoryColors } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

const PAGE_SIZE = 10

const categories = ['Todas categorias', ...Array.from(new Set(allExpenses.map((e) => e.category)))]
const methods = ['Todos os métodos', 'pix', 'visa', 'mastercard']

const methodLabel: Record<string, string> = { pix: 'Pix', visa: 'Visa', mastercard: 'Mastercard' }
const methodColor: Record<string, string> = { pix: '#4B9B7A', visa: '#5B8DEF', mastercard: '#E05C5C' }

export default function GastosTable() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas categorias')
  const [method, setMethod] = useState('Todos os métodos')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return allExpenses.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'Todas categorias' || e.category === category
      const matchMethod = method === 'Todos os métodos' || e.method === method
      return matchSearch && matchCat && matchMethod
    })
  }, [search, category, method])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilter = () => { setPage(1) }

  return (
    <div className="rounded-xl flex flex-col" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: '#2A2A38' }}>
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-xs"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38' }}
        >
          <Search size={13} style={{ color: '#6B6B80' }} />
          <input
            type="text"
            placeholder="Buscar gasto..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); handleFilter() }}
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: '#F0F0F5' }}
          />
        </div>

        {/* Category filter */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-xs"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}
        >
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); handleFilter() }}
            className="bg-transparent outline-none cursor-pointer text-xs"
            style={{ color: '#D0D0D8' }}
          >
            {categories.map((c) => <option key={c} value={c} style={{ backgroundColor: '#16161E' }}>{c}</option>)}
          </select>
          <ChevronDown size={12} style={{ color: '#6B6B80' }} />
        </div>

        {/* Method filter */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}
        >
          <select
            value={method}
            onChange={(e) => { setMethod(e.target.value); handleFilter() }}
            className="bg-transparent outline-none cursor-pointer text-xs"
            style={{ color: '#D0D0D8' }}
          >
            {methods.map((m) => (
              <option key={m} value={m} style={{ backgroundColor: '#16161E' }}>
                {m === 'Todos os métodos' ? m : methodLabel[m]}
              </option>
            ))}
          </select>
          <ChevronDown size={12} style={{ color: '#6B6B80' }} />
        </div>

        <div className="flex-1" />

        {/* Export */}
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ border: '1px solid #2A2A38', color: '#9090A0' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C9A86A')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2A2A38')}
        >
          <Upload size={13} />
          Exportar
        </button>
      </div>

      {/* Header */}
      <div
        className="grid text-[11px] font-medium px-4 py-2.5 border-b"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
          color: '#6B6B80',
          borderColor: '#2A2A38',
        }}
      >
        <span>Descrição</span>
        <span>Categoria</span>
        <span>Data</span>
        <span>Valor</span>
        <span>Método</span>
        <span className="text-right">Ações</span>
      </div>

      {/* Rows */}
      <div className="flex-1">
        {pageItems.map((expense) => {
          const cat = categoryColors[expense.category] ?? categoryColors['Outros']
          return (
            <div
              key={expense.id}
              className="grid items-center px-4 py-3 border-b transition-colors"
              style={{
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
                borderColor: '#1E1E28',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E1E28')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: '#0F0F15' }}
                >
                  {expense.icon}
                </div>
                <span className="text-xs font-medium truncate" style={{ color: '#F0F0F5' }}>
                  {expense.name}
                </span>
              </div>

              {/* Category badge */}
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full w-fit"
                style={{ backgroundColor: cat.bg, color: cat.text }}
              >
                {expense.category}
              </span>

              {/* Date */}
              <span className="text-xs" style={{ color: '#9090A0' }}>
                {formatDate(expense.date)}
              </span>

              {/* Amount */}
              <span className="text-xs font-semibold tabular-nums" style={{ color: '#E05C5C' }}>
                -{formatCurrency(expense.amount)}
              </span>

              {/* Method */}
              <span
                className="text-[11px] font-medium"
                style={{ color: methodColor[expense.method] }}
              >
                {methodLabel[expense.method]}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ color: '#6B6B80' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2A2A38'; e.currentTarget.style.color = '#C9A86A' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B6B80' }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ color: '#6B6B80' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(224,92,92,0.12)'; e.currentTarget.style.color = '#E05C5C' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B6B80' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[11px]" style={{ color: '#6B6B80' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ color: '#9090A0' }}
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-colors"
              style={{
                backgroundColor: page === p ? '#C9A86A' : 'transparent',
                color: page === p ? '#1B1B1F' : '#9090A0',
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ color: '#9090A0' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
