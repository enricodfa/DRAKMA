'use client'

import { ChevronLeft, ChevronRight, Crown } from 'lucide-react'
import SidebarNav from './SidebarNav'

type SidebarProps = {
  expanded: boolean
  onToggle: () => void
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: '#1B1B1F' }}>
      {/* Header: logo + toggle */}
      <div
        className="flex items-center h-14 border-b px-4"
        style={{ borderColor: '#2A2A31', justifyContent: expanded ? 'space-between' : 'center' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            style={{ backgroundColor: '#C9A86A' }}
          >
            🦉
          </div>
          {expanded && (
            <span className="text-sm font-bold tracking-wide" style={{ color: '#C9A86A', letterSpacing: '0.05em' }}>
              DRAKMA
            </span>
          )}
        </div>

        {expanded ? (
          <button
            onClick={onToggle}
            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
            style={{ color: '#6B6B80' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2A2A31')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ChevronLeft size={14} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-4 w-6 h-6 rounded-full flex items-center justify-center border z-10"
            style={{ backgroundColor: '#1B1B1F', borderColor: '#2A2A31', color: '#9090A0' }}
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 overflow-y-auto">
        <SidebarNav expanded={expanded} />
      </div>

      {/* Premium card */}
      {expanded && (
        <div className="px-3 pb-3">
          <div
            className="rounded-xl p-3 border"
            style={{ backgroundColor: '#2A2A31', borderColor: 'rgba(201,168,106,0.19)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} style={{ color: '#C9A86A' }} />
              <span className="text-xs font-semibold" style={{ color: '#C9A86A' }}>
                Drakma Premium
              </span>
            </div>
            <p className="text-[11px] mb-3" style={{ color: '#6B6B80' }}>
              Relatórios avançados e IA sem limites
            </p>
            <button
              className="w-full py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Profile */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-t"
        style={{ borderColor: '#2A2A31' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
        >
          A
        </div>
        {expanded && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Ana Lima</p>
            <p className="text-[10px]" style={{ color: '#6B6B80' }}>Plano Free</p>
          </div>
        )}
      </div>
    </div>
  )
}
