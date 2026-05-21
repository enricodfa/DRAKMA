'use client'

import { PieChart, Pie, Cell, Label, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { Gasto } from '@/lib/supabase/queries'

const COLORS = ['#C9A86A', '#E05C5C', '#4B9B7A', '#8B7EC8', '#5B8DEF', '#D0D0D8']

type Props = { gastos: Gasto[] }

export default function GastosRightPanel({ gastos }: Props) {
  const categoryMap: Record<string, number> = {}
  gastos.forEach(g => {
    categoryMap[g.category] = (categoryMap[g.category] ?? 0) + g.amount
  })
  const total = Object.values(categoryMap).reduce((s, v) => s + v, 0)
  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length],
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))

  const monthMap: Record<string, number> = {}
  gastos.forEach(g => {
    const d = new Date(g.date + 'T12:00:00')
    const key = d.toLocaleDateString('pt-BR', { month: 'short' })
    monthMap[key] = (monthMap[key] ?? 0) + g.amount
  })
  const monthlyData = Object.entries(monthMap).slice(-6).map(([month, value]) => ({ month, value }))

  function CenterLabel() {
    return (
      <g>
        <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 16, fontWeight: 700, fill: '#F0F0F5' }}>
          {formatCurrency(total)}
        </text>
        <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 10, fill: '#6B6B80' }}>
          Total gasto
        </text>
      </g>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Donut */}
      <div className="rounded-xl p-4" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: '#F0F0F5' }}>Gastos por categoria</p>
        {categories.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: '#6B6B80' }}>Sem dados ainda</p>
        ) : (
          <>
            <div className="flex justify-center">
              <PieChart width={160} height={160}>
                <Pie data={categories} dataKey="value" cx="50%" cy="50%"
                  innerRadius={50} outerRadius={72} startAngle={90} endAngle={-270} strokeWidth={0}>
                  {categories.map(cat => <Cell key={cat.name} fill={cat.color} />)}
                  <Label content={<CenterLabel />} position="center" />
                </Pie>
              </PieChart>
            </div>
            <div className="flex flex-col gap-1.5 mt-3">
              {categories.map(cat => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs flex-1" style={{ color: '#9090A0' }}>{cat.name}</span>
                  <span className="text-xs font-medium tabular-nums" style={{ color: '#D0D0D8' }}>{formatCurrency(cat.value)}</span>
                  <span className="text-[11px] w-8 text-right" style={{ color: '#6B6B80' }}>{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bar chart */}
      {monthlyData.length > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#F0F0F5' }}>Evolução mensal</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [formatCurrency(Number(v)), 'Gastos']}
                contentStyle={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', borderRadius: 8, fontSize: 11 }}
              />
              <Bar dataKey="value" fill="#C9A86A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
