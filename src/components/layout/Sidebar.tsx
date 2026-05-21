'use client'

import { ChevronLeft, ChevronRight, Crown } from 'lucide-react'
import SidebarNav from './SidebarNav'
import UserProfile from './UserProfile'

type SidebarProps = {
  expanded: boolean
  onToggle: () => void
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: '#1B1B1F' }}>
      {/* Header: logo + toggle */}
      <div
        className="flex items-center border-b px-4"
        style={{ borderColor: '#2A2A31', height: 69, justifyContent: expanded ? 'space-between' : 'center' }}
      >
        {expanded && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-widest" style={{ color: '#C9A86A', letterSpacing: '0.1em' }}>
              DRAKMA
            </span>
            <span className="text-[10px]" style={{ color: '#6B6B80' }}>v1.0</span>
          </div>
        )}

        {expanded ? (
          <button
            onClick={onToggle}
            className="absolute right-3 top-1/2 w-6 h-6 rounded-md flex items-center justify-center transition-colors"
            style={{ color: '#6B6B80', transform: 'translateY(-50%)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2A2A31')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ChevronLeft size={14} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="absolute -right-3 w-6 h-6 rounded-full flex items-center justify-center border z-10"
            style={{ backgroundColor: '#1B1B1F', borderColor: '#2A2A31', color: '#9090A0', top: '50%', transform: 'translateY(-50%)' }}
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

      <UserProfile expanded={expanded} />
    </div>
  )
}
