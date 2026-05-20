'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="flex h-full" style={{ backgroundColor: '#F4F4F2' }}>
      <div
        style={{
          width: expanded ? 220 : 56,
          minWidth: expanded ? 220 : 56,
          transition: 'width 250ms ease, min-width 250ms ease',
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <Sidebar expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
