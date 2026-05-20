'use client'

import { PieChart, Pie, Cell, Label, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { gastosCategories, monthlyData } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const total = gastosCategories.reduce((s, c) => s + c.value, 0)

function CenterLabel() {
  return (
    <g>
      <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 16, fontWeight: 700, fill: '#F0F0F5', letterSpacing: '-0.5px' }}>
        {formatCurrency(total)}
      </text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 10, fontWeight: 500, fill: '#6B6B80' }}>
        Total
      </text>
    </g>
  )
}

export default function GastosRightPanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* Category donut */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold" style={{ color: '#F0F0F5' }}>Gastos por categoria</p>
          <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ backgroundColor: '#1E1E28', color: '#9090A0' }}>
            Este mês
          </span>
        </div>

        <div className="flex items-center gap-4">
          <PieChart width={140} height={140}>
            <Pie data={gastosCategories} dataKey="value" cx="50%" cy="50%"
              innerRadius={44} outerRadius={64} startAngle={90} endAngle={-270} strokeWidth={0}>
              {gastosCategories.map((cat) => <Cell key={cat.name} fill={cat.color} />)}
              <Label content={<CenterLabel />} position="center" />
            </Pie>
          </PieChart>

          <div className="flex flex-col gap-2 flex-1">
            {gastosCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-[11px] flex-1" style={{ color: '#9090A0' }}>{cat.name}</span>
                <span className="text-[11px] font-medium tabular-nums" style={{ color: '#D0D0D8' }}>
                  {formatCurrency(cat.value)}
                </span>
                <span className="text-[10px] w-7 text-right" style={{ color: '#6B6B80' }}>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution bar chart */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold" style={{ color: '#F0F0F5' }}>Evolução dos gastos</p>
          <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ backgroundColor: '#1E1E28', color: '#9090A0' }}>
            Últimos 6 meses
          </span>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyData} barSize={28} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fill: '#6B6B80', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `R$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E1E28', border: '1px solid #2A2A38', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#9090A0' }}
              formatter={(v) => [formatCurrency(Number(v)), 'Gastos']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {monthlyData.map((entry, i) => (
                <Cell
                  key={entry.month}
                  fill={i === monthlyData.length - 1 ? '#C9A86A' : 'rgba(201,168,106,0.35)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C9A86A' }} />
          <span className="text-[11px]" style={{ color: '#6B6B80' }}>Gastos (R$)</span>
        </div>
      </div>

      {/* Insight card */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
        <span className="text-lg">💡</span>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: '#F0F0F5' }}>Seu gasto em Maio</p>
          <p className="text-[11px] leading-relaxed" style={{ color: '#9090A0' }}>
            Você gastou{' '}
            <span style={{ color: '#4B9B7A' }}>12% menos</span>
            {' '}que em Abril. Continue assim!
          </p>
        </div>
      </div>
    </div>
  )
}
