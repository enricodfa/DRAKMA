'use client'

import { useEffect, useState } from 'react'
import { Bell, ChevronDown, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function TopHeader() {
  const [name, setName] = useState('')

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      const fullName = data.user?.user_metadata?.full_name ?? data.user?.email ?? ''
      const firstName = fullName.split(' ')[0]
      setName(firstName)
    })
  }, [])

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
      style={{ backgroundColor: '#0F0F15', borderColor: '#1E1E28' }}
    >
      <div>
        <h1 className="text-base font-semibold" style={{ color: '#F0F0F5' }}>
          Olá, {name}
        </h1>
        <p className="text-xs" style={{ color: '#6B6B80' }}>
          Aqui está o resumo das suas finanças
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
          style={{ backgroundColor: '#16161E', borderColor: '#2A2A38', color: '#D0D0D8' }}
        >
          Maio 2024
          <ChevronDown size={12} style={{ color: '#6B6B80' }} />
        </button>

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center border"
          style={{ borderColor: '#2A2A38', color: '#6B6B80', backgroundColor: '#16161E' }}
        >
          <Bell size={15} />
        </button>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
        >
          <Plus size={13} />
          Adicionar gasto
        </button>
      </div>
    </header>
  )
}
