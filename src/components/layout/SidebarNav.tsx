'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Sparkles,
  Target,
  Settings,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Gastos', icon: CreditCard, href: '/gastos' },
  { label: 'Receitas', icon: TrendingUp, href: '/receitas' },
  { label: 'Insights IA', icon: Sparkles, href: '/insights' },
  { label: 'Metas', icon: Target, href: '/metas', badge: 'breve' },
  { label: 'Configurações', icon: Settings, href: '/configuracoes' },
]

export default function SidebarNav({ expanded }: { expanded: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5 px-2">
      {navItems.map(({ label, icon: Icon, href, badge }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            title={!expanded ? label : undefined}
            className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-colors"
            style={{
              backgroundColor: active ? 'rgba(201,168,106,0.12)' : 'transparent',
              color: active ? '#C9A86A' : '#9090A0',
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '#242428'
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
          >
            <Icon size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            {expanded && (
              <span className="flex-1 whitespace-nowrap overflow-hidden">{label}</span>
            )}
            {expanded && badge && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: '#2A2A31', color: '#C9A86A' }}
              >
                {badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
