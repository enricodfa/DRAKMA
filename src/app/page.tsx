'use client'

import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TrendingDown, TrendingUp, PieChart, Lock, Zap, CalendarDays, ArrowRight, Check } from 'lucide-react'

const GOLD = '#C9A86A'
const GOLD_DIM = 'rgba(201,168,106,0.12)'
const GOLD_BORDER = 'rgba(201,168,106,0.2)'
const BG = '#0F0F15'
const CARD = '#16161E'
const BORDER = '#2A2A38'
const TEXT = '#F0F0F5'
const MUTED = '#6B6B80'
const FAINT = '#3A3A48'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

async function handleLogin() {
  const supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

const features = [
  {
    icon: <TrendingDown size={22} />,
    title: 'Controle de Gastos',
    desc: 'Registre cada saída com categoria, data e descrição. Veja para onde vai seu dinheiro mês a mês.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Receitas Organizadas',
    desc: 'Cadastre todas as suas fontes de renda — bolsa, freelas, mesada — e acompanhe o fluxo positivo.',
  },
  {
    icon: <PieChart size={22} />,
    title: 'Visão por Categoria',
    desc: 'Gráficos claros mostram onde você mais gasta. Informação visual para decisões mais rápidas.',
  },
  {
    icon: <CalendarDays size={22} />,
    title: 'Histórico Mensal',
    desc: 'Navegue entre meses e compare períodos. Cada mês é um capítulo da sua evolução financeira.',
  },
  {
    icon: <Lock size={22} />,
    title: 'Dados Seguros',
    desc: 'Autenticação via Google. Seus dados são seus — armazenados com Row Level Security no Supabase.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Rápido e Limpo',
    desc: 'Sem curva de aprendizado. Interface pensada para quem tem aulas, estágios e vida social.',
  },
]

const steps = [
  { n: '01', title: 'Entre com Google', desc: 'Um clique. Sem senha, sem formulário, sem burocracia.' },
  { n: '02', title: 'Registre seus gastos', desc: 'Adicione saídas e entradas em segundos — direto do app.' },
  { n: '03', title: 'Veja o panorama', desc: 'Gráficos e totais automáticos. Seu mês financeiro, de relance.' },
]

export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease both; }
        .anim-d1 { animation-delay: 0.1s; }
        .anim-d2 { animation-delay: 0.2s; }
        .anim-d3 { animation-delay: 0.35s; }
        .anim-d4 { animation-delay: 0.5s; }
        .feature-card:hover { border-color: rgba(201,168,106,0.35) !important; }
        .btn-gold:hover { opacity: 0.92; }
        .btn-outline:hover { background: rgba(201,168,106,0.07); }
        .step-line { position: absolute; top: 28px; left: calc(50% + 28px); width: calc(100% - 56px); height: 1px; background: linear-gradient(90deg, rgba(201,168,106,0.4), transparent); }
      `}</style>

      <div style={{ backgroundColor: BG, minHeight: '100vh', color: TEXT, fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

        {/* ── NAV ── */}
        <nav
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            borderBottom: `1px solid ${BORDER}`,
            backgroundColor: 'rgba(15,15,21,0.85)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64 }}
          >
            <div className="flex items-center gap-3">
              <Image src="/DRAKMA LOGO 2.0.png" alt="Drakma" width={32} height={32} style={{ borderRadius: 8 }} />
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.12em', color: GOLD }}>DRAKMA</span>
            </div>
            <button
              onClick={handleLogin}
              className="btn-gold flex items-center gap-2 transition-opacity"
              style={{
                backgroundColor: GOLD, color: '#0F0F15',
                padding: '8px 20px', borderRadius: 10,
                fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
              }}
            >
              Entrar
              <ArrowRight size={14} />
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', paddingTop: 64, paddingBottom: 80,
            background: `radial-gradient(ellipse 70% 55% at 50% 0%, rgba(201,168,106,0.13) 0%, transparent 65%), ${BG}`,
          }}
        >
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `linear-gradient(rgba(42,42,56,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,56,0.25) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)',
          }} />

          <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
            {/* Badge */}
            <div className="animate-fade-up anim-d1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 999,
                border: `1px solid ${GOLD_BORDER}`,
                backgroundColor: GOLD_DIM,
                fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                color: GOLD, textTransform: 'uppercase',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: GOLD, display: 'inline-block' }} />
                Gestão financeira para universitários
              </span>
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-up anim-d2"
              style={{
                fontSize: 'clamp(36px, 6vw, 62px)',
                fontWeight: 900, lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: TEXT, marginBottom: 20,
              }}
            >
              Suas finanças.{' '}
              <span style={{
                color: GOLD,
                background: `linear-gradient(135deg, #C9A86A, #E8D09A, #C9A86A)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Finalmente dominadas.
              </span>
            </h1>

            {/* Sub */}
            <p
              className="animate-fade-up anim-d3"
              style={{ fontSize: 17, lineHeight: 1.65, color: MUTED, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}
            >
              Drakma transforma a bagunça financeira do seu mês em clareza total — sem planilha, sem complicação.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up anim-d4 flex items-center justify-center gap-3" style={{ flexWrap: 'wrap' }}>
              <button
                onClick={handleLogin}
                className="btn-gold flex items-center gap-3 transition-opacity"
                style={{
                  backgroundColor: GOLD, color: '#0F0F15',
                  padding: '14px 28px', borderRadius: 12,
                  fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                  boxShadow: `0 8px 32px rgba(201,168,106,0.25)`,
                }}
              >
                <GoogleIcon />
                Entrar com Google — é grátis
              </button>
            </div>

            <p style={{ marginTop: 16, fontSize: 12, color: FAINT }}>
              Sem cartão de crédito · Acesso imediato
            </p>
          </div>

          {/* Mini dashboard preview */}
          <div
            style={{
              marginTop: 72, maxWidth: 800, width: '100%', padding: '0 24px',
              position: 'relative',
            }}
          >
            <div style={{
              borderRadius: 20,
              border: `1px solid ${BORDER}`,
              backgroundColor: CARD,
              overflow: 'hidden',
              boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,106,0.06)`,
            }}>
              {/* Fake browser bar */}
              <div style={{
                backgroundColor: '#13131A',
                padding: '12px 16px',
                borderBottom: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#E05C5C', '#E0A85C', '#5CE080'].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
                  ))}
                </div>
                <div style={{
                  flex: 1, maxWidth: 200, margin: '0 auto',
                  backgroundColor: '#1E1E2A', borderRadius: 6,
                  padding: '4px 12px', fontSize: 11, color: MUTED, textAlign: 'center',
                }}>
                  drakma.app/dashboard
                </div>
              </div>

              {/* Fake dashboard content */}
              <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'Total de Gastos', value: 'R$ 1.842,50', color: '#E05C5C', up: false },
                  { label: 'Total de Receitas', value: 'R$ 2.600,00', color: '#4B9B7A', up: true },
                  { label: 'Saldo do Mês', value: 'R$ 757,50', color: GOLD, up: true },
                ].map((card, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#13131A',
                      borderRadius: 12,
                      padding: '16px 18px',
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <p style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{card.label}</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: card.color }}>{card.value}</p>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: card.color }}>{card.up ? '↑' : '↓'} vs mês anterior</span>
                    </div>
                  </div>
                ))}

                {/* Bar chart placeholder */}
                <div style={{
                  gridColumn: '1 / 3',
                  backgroundColor: '#13131A', borderRadius: 12, padding: '16px 18px',
                  border: `1px solid ${BORDER}`,
                }}>
                  <p style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>Gastos por categoria</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 52 }}>
                    {[65, 45, 80, 30, 55, 70, 40].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, borderRadius: 4,
                          backgroundColor: i === 2 ? GOLD : 'rgba(201,168,106,0.2)',
                          height: `${h}%`,
                          transition: 'height 0.3s',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent list placeholder */}
                <div style={{
                  backgroundColor: '#13131A', borderRadius: 12, padding: '16px 18px',
                  border: `1px solid ${BORDER}`,
                }}>
                  <p style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>Últimos gastos</p>
                  {['Mercado', 'Uber', 'iFood'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: TEXT }}>{item}</span>
                      <span style={{ fontSize: 11, color: '#E05C5C' }}>- R$ {[89, 24, 47][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow under preview */}
            <div style={{
              position: 'absolute', bottom: -40, left: '20%', right: '20%',
              height: 80, borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(201,168,106,0.12) 0%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ padding: '100px 24px', borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p style={{ fontSize: 12, color: GOLD, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Tudo o que você precisa
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.2, marginBottom: 14 }}>
                Controle real. Interface limpa.
              </h2>
              <p style={{ fontSize: 16, color: MUTED, maxWidth: 480, margin: '0 auto' }}>
                Nenhuma funcionalidade desnecessária. Só o que você vai de fato usar todo dia.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {features.map((f, i) => (
                <div
                  key={i}
                  className="feature-card"
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16, padding: '28px 28px',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: GOLD_DIM,
                    border: `1px solid ${GOLD_BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: GOLD, marginBottom: 18,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: '100px 24px', borderTop: `1px solid ${BORDER}`, backgroundColor: '#0C0C11' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontSize: 12, color: GOLD, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Como funciona
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: TEXT, lineHeight: 1.2 }}>
                Três passos. Menos de um minuto.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative' }}>
              {steps.map((s, i) => (
                <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 27, left: 'calc(50% + 30px)',
                      width: 'calc(100% - 60px)', height: 1,
                      background: `linear-gradient(90deg, ${GOLD_BORDER}, transparent)`,
                    }} />
                  )}
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    backgroundColor: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: 18, fontWeight: 800, color: GOLD,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {s.n}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ padding: '100px 24px', borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              borderRadius: 24,
              border: `1px solid ${GOLD_BORDER}`,
              backgroundColor: CARD,
              padding: '60px 40px',
              position: 'relative', overflow: 'hidden',
              boxShadow: `0 0 80px rgba(201,168,106,0.06)`,
            }}>
              {/* Glow inside card */}
              <div style={{
                position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
                width: 300, height: 200,
                background: 'radial-gradient(ellipse, rgba(201,168,106,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <Image
                src="/DRAKMA LOGO 2.0.png"
                alt="Drakma"
                width={64} height={64}
                style={{ borderRadius: 16, marginBottom: 24, border: `1px solid ${GOLD_BORDER}` }}
              />

              <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: TEXT, marginBottom: 14, lineHeight: 1.2 }}>
                Pronto para ter clareza financeira?
              </h2>
              <p style={{ fontSize: 16, color: MUTED, marginBottom: 36, lineHeight: 1.65 }}>
                Junte-se a quem já controla seus gastos com inteligência.
                É gratuito. Para sempre.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={handleLogin}
                  className="btn-gold flex items-center gap-3 transition-opacity"
                  style={{
                    backgroundColor: GOLD, color: '#0F0F15',
                    padding: '15px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                    boxShadow: `0 8px 32px rgba(201,168,106,0.25)`,
                    width: '100%', maxWidth: 320,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}
                >
                  <GoogleIcon />
                  Entrar com Google
                </button>

                <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                  {['Gratuito', 'Sem cartão', 'Acesso imediato'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Check size={12} style={{ color: GOLD }} />
                      <span style={{ fontSize: 12, color: MUTED }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: `1px solid ${BORDER}`,
          padding: '32px 24px',
        }}>
          <div
            style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Image src="/DRAKMA LOGO 2.0.png" alt="Drakma" width={24} height={24} style={{ borderRadius: 6 }} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: GOLD }}>DRAKMA</span>
              <span style={{ fontSize: 12, color: FAINT }}>v1.0</span>
            </div>
            <p style={{ fontSize: 12, color: FAINT }}>
              © 2025 Drakma · Finanças Inteligentes
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}
