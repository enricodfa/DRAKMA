import type { Insight } from '@/lib/mock-data'

type InsightCardProps = {
  insight: Insight
}

export default function InsightCard({ insight }: InsightCardProps) {
  const parts = insight.text.split('{highlight}')

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: '#242428' }}
    >
      <span className="text-xl leading-none">{insight.icon}</span>
      <p className="text-xs leading-relaxed" style={{ color: '#D0D0D8' }}>
        {parts[0]}
        <span className="font-semibold" style={{ color: '#C9A86A' }}>
          {insight.highlight}
        </span>
        {parts[1]}
      </p>
    </div>
  )
}
