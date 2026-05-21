'use client'

import { useEffect, useState } from 'react'
import { LogOut, Mail, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    await createClient().auth.signOut()
    router.push('/login')
  }

  const name = user?.user_metadata?.full_name ?? '—'
  const email = user?.email ?? '—'
  const avatar = user?.user_metadata?.avatar_url
  const initial = name[0]?.toUpperCase() ?? 'U'
  const provider = user?.app_metadata?.provider ?? 'google'
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <header className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#1E1E28' }}>
        <div>
          <h1 className="text-base font-semibold" style={{ color: '#F0F0F5' }}>Configurações</h1>
          <p className="text-xs" style={{ color: '#6B6B80' }}>Gerencie sua conta e preferências.</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div style={{ maxWidth: 560 }} className="flex flex-col gap-4">

          {/* Profile card */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
            <p className="text-xs font-semibold mb-5 uppercase tracking-widest" style={{ color: '#6B6B80' }}>Perfil</p>

            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-6">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={name}
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #2A2A38' }}
                />
              ) : (
                <div
                  className="flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#C9A86A', color: '#1B1B1F' }}
                >
                  {initial}
                </div>
              )}
              <div>
                <p className="text-base font-semibold" style={{ color: '#F0F0F5' }}>{name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B6B80' }}>
                  Conta conectada via {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </p>
              </div>
            </div>

            {/* Info rows */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#0F0F15', border: '1px solid #1E1E28' }}>
                <User size={14} style={{ color: '#6B6B80', flexShrink: 0 }} />
                <div className="flex-1">
                  <p className="text-[11px]" style={{ color: '#6B6B80' }}>Nome completo</p>
                  <p className="text-sm font-medium" style={{ color: '#D0D0D8' }}>{name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#0F0F15', border: '1px solid #1E1E28' }}>
                <Mail size={14} style={{ color: '#6B6B80', flexShrink: 0 }} />
                <div className="flex-1">
                  <p className="text-[11px]" style={{ color: '#6B6B80' }}>E-mail</p>
                  <p className="text-sm font-medium" style={{ color: '#D0D0D8' }}>{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#0F0F15', border: '1px solid #1E1E28' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>📅</span>
                <div className="flex-1">
                  <p className="text-[11px]" style={{ color: '#6B6B80' }}>Membro desde</p>
                  <p className="text-sm font-medium" style={{ color: '#D0D0D8' }}>{createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
            <p className="text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: '#6B6B80' }}>Sessão</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'rgba(224,92,92,0.12)', color: '#E05C5C', border: '1px solid rgba(224,92,92,0.2)' }}
            >
              <LogOut size={14} />
              Sair da conta
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
