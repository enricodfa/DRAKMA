'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import MonthPicker from '@/components/ui/MonthPicker'

export default function TopHeader() {
  const [name, setName] = useState('')

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      const fullName = data.user?.user_metadata?.full_name ?? data.user?.email ?? ''
      setName(fullName.split(' ')[0])
    })
  }, [])

  return (
    <header
      className="flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{ height: 69, backgroundColor: '#0F0F15', borderColor: '#1E1E28' }}
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
        <MonthPicker align="right" />
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center border"
          style={{ borderColor: '#2A2A38', color: '#6B6B80', backgroundColor: '#16161E' }}
        >
          <Bell size={15} />
        </button>
      </div>
    </header>
  )
}
