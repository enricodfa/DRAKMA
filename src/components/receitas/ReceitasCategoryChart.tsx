'use client'

import { PieChart, Pie, Cell, Label } from 'recharts'
import { incomeCategories } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const total = incomeCategories.reduce((s, c) => s + c.value, 0)

function CenterLabel() {
  return (
    <g>
      <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 16, fontWeight: 700, fill: '#F0F0F5' }}>
        {formatCurrency(total)}
      </text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 10, fill: '#6B6B80' }}>
        Total
      </text>
    </g>
  )
}

export default function ReceitasCategoryChart() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col"
      style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
    >
      <p className="text-sm font-semibold mb-4" style={{ color: '#F0F0F5' }}>
        Receitas por categoria
      </p>

      <div className="flex items-center gap-5">
        <PieChart width={160} height={160}>
          <Pie
            data={incomeCategories}
            dataKey="value"
            cx="50%" cy="50%"
            innerRadius={50} outerRadius={72}
            startAngle={90} endAngle={-270}
            strokeWidth={0}
          >
            {incomeCategories.map((cat) => (
              <Cell key={cat.name} fill={cat.color} />
            ))}
            <Label content={<CenterLabel />} position="center" />
          </Pie>
        </PieChart>

        <div className="flex flex-col gap-2 flex-1">
          {incomeCategories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-xs flex-1" style={{ color: '#9090A0' }}>{cat.name}</span>
              <span className="text-xs font-medium tabular-nums" style={{ color: '#D0D0D8' }}>
                {formatCurrency(cat.value)}
              </span>
              <span className="text-[11px] w-10 text-right" style={{ color: '#6B6B80' }}>
                {cat.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
