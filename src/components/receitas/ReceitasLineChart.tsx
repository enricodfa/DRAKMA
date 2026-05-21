'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ChevronDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { MonthlyData } from '@/lib/mock-data'

type Props = { monthlyData: MonthlyData[] }

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}>
      {formatCurrency(payload[0].value)}
    </div>
  )
}

export default function ReceitasLineChart({ monthlyData }: Props) {
  return (
    <div className="rounded-xl p-5 flex flex-col flex-1" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>Evolução das receitas</p>
        <button
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg"
          style={{ backgroundColor: '#1E1E28', border: '1px solid #2A2A38', color: '#9090A0' }}
        >
          Últimos 6 meses <ChevronDown size={11} />
        </button>
      </div>
      <div className="flex-1" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A86A" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#C9A86A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#1E1E28" />
            <XAxis dataKey="month" tick={{ fill: '#6B6B80', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `R$ ${v}`} tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C9A86A', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="value" stroke="#C9A86A" strokeWidth={2} fill="url(#incomeGrad)"
              dot={{ fill: '#C9A86A', r: 3, strokeWidth: 0 }} activeDot={{ fill: '#C9A86A', r: 5, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #1E1E28' }}>
        <div className="w-5 h-0.5 rounded" style={{ backgroundColor: '#C9A86A' }} />
        <span className="text-[11px]" style={{ color: '#6B6B80' }}>Receitas (R$)</span>
      </div>
    </div>
  )
}
