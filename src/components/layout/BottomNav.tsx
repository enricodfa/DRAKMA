'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, TrendingUp, Settings } from 'lucide-react'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Gastos', icon: CreditCard, href: '/gastos' },
  { label: 'Receitas', icon: TrendingUp, href: '/receitas' },
  { label: 'Config', icon: Settings, href: '/configuracoes' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 flex items-center z-50"
      style={{
        height: 64,
        backgroundColor: '#1B1B1F',
        borderTop: '1px solid #2A2A38',
      }}
    >
      {items.map(({ label, icon: Icon, href }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            style={{ color: active ? '#C9A86A' : '#6B6B80' }}
          >
            <Icon size={20} strokeWidth={1.8} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
