'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

type AppShellProps = {
  children: React.ReactNode
  colorScheme?: 'light' | 'dark'
}

export default function AppShell({ children, colorScheme = 'light' }: AppShellProps) {
  const [expanded, setExpanded] = useState(true)
  const bg = colorScheme === 'dark' ? '#0F0F15' : '#F4F4F2'

  return (
    <div className="flex h-full" style={{ backgroundColor: bg }}>
      {/* Sidebar — desktop only */}
      <div
        className="hidden md:block flex-shrink-0"
        style={{
          width: expanded ? 280 : 56,
          minWidth: expanded ? 280 : 56,
          transition: 'width 250ms ease, min-width 250ms ease',
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <Sidebar expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      </div>

      {/* Main content — extra bottom padding on mobile for bottom nav */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden pb-16 md:pb-0">
        {children}
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  )
}
