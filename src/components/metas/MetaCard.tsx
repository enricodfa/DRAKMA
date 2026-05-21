'use client'

import { Pencil, Trash2, CalendarDays, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Meta } from '@/lib/supabase/metas'

type Props = {
  meta: Meta
  onEdit: () => void
  onDelete: () => void
}

function getTimeRemaining(deadline: string): { label: string; color: string; urgent: boolean } {
  const today = new Date(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()))
  const end = new Date(deadline + 'T12:00:00')
  const diffMs = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: 'Prazo encerrado', color: '#E05C5C', urgent: true }
  if (diffDays === 0) return { label: 'Vence hoje', color: '#E05C5C', urgent: true }
  if (diffDays === 1) return { label: '1 dia restante', color: '#E05C5C', urgent: true }
  if (diffDays <= 7) return { label: `${diffDays} dias restantes`, color: '#E0A85C', urgent: true }
  if (diffDays <= 30) return { label: `${diffDays} dias restantes`, color: '#C9A86A', urgent: false }

  const months = Math.floor(diffDays / 30)
  const days = diffDays % 30

  if (months < 12) {
    const label = days > 0
      ? `${months} ${months === 1 ? 'mês' : 'meses'} e ${days} ${days === 1 ? 'dia' : 'dias'}`
      : `${months} ${months === 1 ? 'mês' : 'meses'} restantes`
    return { label, color: '#9090A0', urgent: false }
  }

  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const label = remMonths > 0
    ? `${years} ${years === 1 ? 'ano' : 'anos'} e ${remMonths} ${remMonths === 1 ? 'mês' : 'meses'}`
    : `${years} ${years === 1 ? 'ano' : 'anos'} restantes`
  return { label, color: '#9090A0', urgent: false }
}

export default function MetaCard({ meta, onEdit, onDelete }: Props) {
  const pct = meta.target_amount > 0
    ? Math.min(100, Math.round((meta.current_amount / meta.target_amount) * 100))
    : 0

  const done = pct >= 100
  const timeInfo = !done && meta.deadline ? getTimeRemaining(meta.deadline) : null

  const deadlineLabel = meta.deadline
    ? new Date(meta.deadline + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  const progressColor = done ? '#4B9B7A' : pct >= 66 ? '#C9A86A' : pct >= 33 ? '#5B8DEF' : '#E05C5C'

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: '#16161E', border: `1px solid ${done ? 'rgba(75,155,122,0.3)' : '#2A2A38'}` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 48, height: 48, backgroundColor: '#0F0F15', fontSize: 24 }}
          >
            {meta.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>{meta.name}</h3>
            {deadlineLabel && (
              <div className="flex items-center gap-1 mt-0.5">
                <CalendarDays size={11} style={{ color: '#6B6B80' }} />
                <span className="text-[11px]" style={{ color: '#6B6B80' }}>{deadlineLabel}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ color: '#6B6B80', backgroundColor: '#0F0F15' }}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ color: '#6B6B80', backgroundColor: '#0F0F15' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Countdown */}
      {timeInfo && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: timeInfo.urgent ? 'rgba(224,92,92,0.08)' : 'rgba(144,144,160,0.06)',
            border: `1px solid ${timeInfo.urgent ? 'rgba(224,92,92,0.2)' : '#2A2A38'}`,
          }}
        >
          <Clock size={12} style={{ color: timeInfo.color, flexShrink: 0 }} />
          <span className="text-xs font-medium" style={{ color: timeInfo.color }}>
            {timeInfo.label}
          </span>
        </div>
      )}

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: '#9090A0' }}>Progresso</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: progressColor }}>{pct}%</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 6, backgroundColor: '#0F0F15' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: progressColor }}
          />
        </div>
      </div>

      {/* Amounts */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px]" style={{ color: '#6B6B80' }}>Guardado</p>
          <p className="text-sm font-bold tabular-nums" style={{ color: progressColor }}>
            {formatCurrency(meta.current_amount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px]" style={{ color: '#6B6B80' }}>Alvo</p>
          <p className="text-sm font-bold tabular-nums" style={{ color: '#F0F0F5' }}>
            {formatCurrency(meta.target_amount)}
          </p>
        </div>
      </div>

      {done && (
        <div
          className="rounded-lg py-1.5 text-center text-xs font-semibold"
          style={{ backgroundColor: 'rgba(75,155,122,0.12)', color: '#4B9B7A', border: '1px solid rgba(75,155,122,0.2)' }}
        >
          ✓ Meta atingida!
        </div>
      )}
    </div>
  )
}
