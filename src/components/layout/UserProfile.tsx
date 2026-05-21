'use client'

import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function UserProfile({ expanded }: { expanded: boolean }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const name = user?.user_metadata?.full_name ?? user?.email ?? 'Usuário'
  const avatar = user?.user_metadata?.avatar_url
  const initial = name[0]?.toUpperCase() ?? 'U'

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-t"
      style={{ borderColor: '#2A2A31' }}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={name}
          style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
        >
          {initial}
        </div>
      )}

      {expanded && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{name}</p>
            <p className="text-[10px]" style={{ color: '#6B6B80' }}>Plano Free</p>
          </div>
          <button
            onClick={handleLogout}
            className="hover:opacity-70 transition-opacity"
            style={{ color: '#6B6B80' }}
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </>
      )}
    </div>
  )
}
