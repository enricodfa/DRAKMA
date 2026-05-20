'use client'

import { Bell, ChevronDown, Plus } from 'lucide-react'

type TopHeaderProps = {
  name?: string
}

export default function TopHeader({ name = 'Ana' }: TopHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E3' }}
    >
      {/* Saudação */}
      <div>
        <h1 className="text-base font-semibold" style={{ color: '#1B1B1F' }}>
          Olá, {name} 👋
        </h1>
        <p className="text-xs" style={{ color: '#9090A0' }}>
          Aqui está o resumo das suas finanças
        </p>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        {/* Seletor de mês */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:border-gray-300"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E5E3',
            color: '#1B1B1F',
          }}
        >
          Maio 2024
          <ChevronDown size={12} style={{ color: '#9090A0' }} />
        </button>

        {/* Notificações */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-50"
          style={{ borderColor: '#E5E5E3', color: '#9090A0' }}
        >
          <Bell size={15} />
        </button>

        {/* Adicionar gasto */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{ backgroundColor: '#1B1B1F', color: '#FFFFFF' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2A2A31')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1B1B1F')}
        >
          <Plus size={13} />
          Adicionar gasto
        </button>
      </div>
    </header>
  )
}
