'use client'

import { PieChart, Pie, Cell, Label } from 'recharts'
import { categories } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

const total = categories.reduce((sum, c) => sum + c.value, 0)

function CenterLabel() {
  return (
    <g>
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 20, fontWeight: 700, fill: '#1B1B1F', letterSpacing: '-0.5px' }}
      >
        {formatCurrency(total)}
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 11, fontWeight: 500, fill: '#9090A0' }}
      >
        Total gasto
      </text>
    </g>
  )
}

export default function CategoryChart() {
  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        padding: '20px',
      }}
    >
      {/* Title */}
      <p className="text-[13px] font-semibold mb-4" style={{ color: '#1B1B1F' }}>
        Gastos por categoria
      </p>

      {/* Donut */}
      <div className="flex justify-center">
        <PieChart width={200} height={200}>
          <Pie
            data={categories}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={90}
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
          >
            {categories.map((cat) => (
              <Cell key={cat.name} fill={cat.color} />
            ))}
            <Label content={<CenterLabel />} position="center" />
          </Pie>
        </PieChart>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-4 flex-1">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-xs flex-1" style={{ color: '#555555' }}>
              {cat.name}
            </span>
            <span className="text-xs font-medium tabular-nums" style={{ color: '#1B1B1F' }}>
              {formatCurrency(cat.value)}
            </span>
            <span className="text-[11px] w-8 text-right" style={{ color: '#9090A0' }}>
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t" style={{ borderColor: '#F5F5F3' }}>
        <Link
          href="/gastos"
          className="text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: '#C9A86A' }}
        >
          Ver relatório completo →
        </Link>
      </div>
    </div>
  )
}
