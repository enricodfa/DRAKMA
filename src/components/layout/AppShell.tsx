'use client'

import { useState } from 'react'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="flex h-full" style={{ backgroundColor: '#F4F4F2' }}>
      {/* Sidebar placeholder — replaced in Task 8 */}
      <div
        style={{
          width: expanded ? 220 : 56,
          minWidth: expanded ? 220 : 56,
          transition: 'width 250ms ease, min-width 250ms ease',
          backgroundColor: '#1B1B1F',
        }}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export { type AppShellProps }
export { AppShell }
