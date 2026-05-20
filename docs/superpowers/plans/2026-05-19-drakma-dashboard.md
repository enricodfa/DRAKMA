# Drakma Dashboard MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete desktop-first Drakma financial dashboard MVP — sidebar colapsável, bento grid assimétrico, donut chart, painel de insights dark e assistente IA com typing animation, tudo com dados mockados.

**Architecture:** Next.js 14 App Router com feature-folder organization. `AppShell` (client component) gerencia o estado de colapso da sidebar e envolve todas as páginas. Dados financeiros são estáticos em `mock-data.ts`. Zustand gerencia apenas o estado do chat IA. Componentes são presentacionais puros exceto `Sidebar`, `AIAssistant` e `TopHeader`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Zustand, Lucide React, Jest

---

## File Map

```
src/
├── app/
│   ├── layout.tsx                     # Root layout (server) — wraps AppShell
│   ├── page.tsx                       # Redirect to /dashboard
│   ├── globals.css                    # Tailwind base + CSS vars
│   ├── dashboard/page.tsx             # Dashboard principal
│   ├── gastos/page.tsx                # Stub page
│   ├── receitas/page.tsx              # Stub page
│   ├── insights/page.tsx              # Stub page
│   └── configuracoes/page.tsx         # Stub page
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx               # Client — sidebar collapse state
│   │   ├── Sidebar.tsx                # Client — collapsible sidebar (220px ↔ 56px)
│   │   ├── SidebarNav.tsx             # Nav items with active state
│   │   └── TopHeader.tsx              # Client — greeting, month selector, CTA
│   ├── dashboard/
│   │   ├── SummaryCards.tsx           # 4 summary metric cards
│   │   ├── BentoGrid.tsx              # Asymmetric 3-col grid layout
│   │   ├── CategoryChart.tsx          # Client — Recharts donut + legend
│   │   ├── RecentExpenses.tsx         # Latest 5 expenses list
│   │   └── InsightBanner.tsx          # Dark banner with 3 insight cards
│   ├── insights/
│   │   └── InsightCard.tsx            # Reusable individual insight card
│   └── ai/
│       ├── AIAssistant.tsx            # Client — chat UI + send logic
│       └── useTypingEffect.ts         # Hook — char-by-char typing animation
├── lib/
│   ├── mock-data.ts                   # All static data + findAIResponse()
│   ├── utils.ts                       # cn(), formatCurrency(), formatDate()
│   └── __tests__/
│       └── utils.test.ts
└── store/
    ├── ai-chat.ts                     # Zustand store — messages + isTyping
    └── __tests__/
        └── ai-chat.test.ts
```

---

## Task 1: Scaffold project + install dependencies

**Files:**
- Create: `package.json` (via create-next-app)
- Modify: `package.json` (add recharts, zustand, lucide-react)

- [ ] **Step 1: Scaffold Next.js project in current directory**

Run in `c:\Users\Jonh Pork\Desktop\CLAUDINHO\PROJETOS\DRAKMA V1`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```
Expected: project scaffolded. `src/app/`, `tailwind.config.ts`, `tsconfig.json` created.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install recharts zustand lucide-react clsx tailwind-merge
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init --yes
```
When prompted, accept defaults (style: Default, base color: Neutral, CSS variables: yes).

- [ ] **Step 4: Install Jest**

```bash
npm install --save-dev jest jest-environment-jsdom @types/jest ts-jest
```

- [ ] **Step 5: Create jest.config.ts**

Create `jest.config.ts` at project root:
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 6: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 project with deps"
```

---

## Task 2: Tailwind config with Drakma design tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#1B1B1F',
          surface: '#2A2A31',
          hover: '#242428',
          border: '#2A2A31',
          muted: '#6B6B80',
          text: '#9090A0',
        },
        gold: {
          DEFAULT: '#C9A86A',
          light: '#D9BE87',
          subtle: 'rgba(201,168,106,0.12)',
        },
        surface: {
          bg: '#F4F4F2',
          card: '#FFFFFF',
          border: '#E5E5E3',
          muted: '#F5F5F3',
          hover: '#F0F0EE',
        },
        ink: {
          DEFAULT: '#1B1B1F',
          muted: '#9090A0',
          faint: '#555555',
        },
        expense: '#E05C5C',
        income: '#C9A86A',
        positive: '#4B9B7A',
        forecast: '#5B8DEF',
        purple: '#8B7EC8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        sidebar: '10px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
      },
      transitionDuration: {
        sidebar: '250ms',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #F4F4F2;
  color: #1B1B1F;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #D0D0D8;
  border-radius: 2px;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: add Drakma design tokens to Tailwind"
```

---

## Task 3: Utility functions (TDD)

**Files:**
- Create: `src/lib/__tests__/utils.test.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/utils.test.ts`:
```typescript
import { formatCurrency, formatDate, cn } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats a whole number as BRL', () => {
    const result = formatCurrency(1200)
    expect(result).toContain('1.200')
    expect(result).toContain('R$')
  })

  it('formats a decimal value as BRL', () => {
    const result = formatCurrency(35.5)
    expect(result).toContain('35,50')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })
})

describe('formatDate', () => {
  it('formats a date string in pt-BR', () => {
    const result = formatDate('2024-05-23')
    expect(result).toBe('23 de Maio')
  })

  it('formats another date correctly', () => {
    const result = formatDate('2024-05-22')
    expect(result).toBe('22 de Maio')
  })
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges Tailwind conflicts correctly', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern=utils
```
Expected: FAIL — `Cannot find module '@/lib/utils'`

- [ ] **Step 3: Implement utils.ts**

Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- --testPathPattern=utils
```
Expected: PASS — 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils.ts src/lib/__tests__/utils.test.ts
git commit -m "feat: add utility functions (formatCurrency, formatDate, cn)"
```

---

## Task 4: Mock data

**Files:**
- Create: `src/lib/mock-data.ts`

- [ ] **Step 1: Create mock-data.ts with all types and data**

Create `src/lib/mock-data.ts`:
```typescript
export type Category = {
  name: string
  value: number
  color: string
  percentage: number
}

export type Expense = {
  id: string
  name: string
  date: string
  amount: number
  icon: string
  category: string
}

export type FinancialSummary = {
  receitas: number
  gastos: number
  saldo: number
  previsao: number
}

export type Insight = {
  id: string
  icon: string
  text: string
  highlight: string
}

export type AIResponse = {
  keywords: string[]
  response: string
}

export const financialSummary: FinancialSummary = {
  receitas: 1200,
  gastos: 320,
  saldo: 880,
  previsao: 120,
}

export const categories: Category[] = [
  { name: 'Delivery', value: 140, color: '#C9A86A', percentage: 43 },
  { name: 'Transporte', value: 60, color: '#E05C5C', percentage: 19 },
  { name: 'Alimentação', value: 50, color: '#4B9B7A', percentage: 16 },
  { name: 'Lazer', value: 40, color: '#8B7EC8', percentage: 12 },
  { name: 'Outros', value: 30, color: '#D0D0D8', percentage: 10 },
]

export const recentExpenses: Expense[] = [
  { id: '1', name: 'iFood', date: '2024-05-23', amount: 35, icon: '🍔', category: 'Delivery' },
  { id: '2', name: 'Uber', date: '2024-05-23', amount: 18.5, icon: '🚗', category: 'Transporte' },
  { id: '3', name: 'Café da Manhã', date: '2024-05-23', amount: 9.9, icon: '☕', category: 'Alimentação' },
  { id: '4', name: 'Mercado Extra', date: '2024-05-22', amount: 87.3, icon: '🛒', category: 'Alimentação' },
  { id: '5', name: 'Lanche', date: '2024-05-22', amount: 14, icon: '🥪', category: 'Alimentação' },
]

export const insights: Insight[] = [
  {
    id: '1',
    icon: '🛵',
    text: 'Você gastou {highlight} com delivery este mês. Isso representa 43% dos seus gastos.',
    highlight: 'R$ 140,00',
  },
  {
    id: '2',
    icon: '🚗',
    text: 'Seus gastos com transporte aumentaram {highlight} em relação ao mês passado.',
    highlight: '35%',
  },
  {
    id: '3',
    icon: '✅',
    text: 'Se continuar assim, você pode terminar o mês com {highlight} a mais do que planejou.',
    highlight: 'R$ 120,00',
  },
]

const aiResponses: AIResponse[] = [
  {
    keywords: ['final de semana', 'sair', 'festa', 'passeio'],
    response:
      'Considerando seus gastos atuais, você tem **R$ 880,00** disponíveis. Se mantiver o ritmo, poderá gastar até **R$ 80,00** no fim de semana sem comprometer seu orçamento. Quer que eu simule para você?',
  },
  {
    keywords: ['delivery', 'ifood', 'rappi', 'uber eats'],
    response:
      'Você já gastou **R$ 140,00** com delivery este mês — 43% do total. Considere cozinhar em casa 2x por semana para economizar até **R$ 56,00** no mês.',
  },
  {
    keywords: ['transporte', 'uber', 'ônibus', 'gasolina'],
    response:
      'Seus gastos com transporte foram **R$ 60,00** este mês, um aumento de **35%** em relação ao mês passado. Você costuma usar bastante Uber — considere o transporte público em horários não-pico.',
  },
  {
    keywords: ['economizar', 'poupar', 'guardar', 'sobrar'],
    response:
      'Se mantiver o ritmo atual, você vai terminar o mês com **R$ 120,00** sobrando. Para aumentar isso, o principal corte seria em delivery, que representa 43% dos seus gastos.',
  },
  {
    keywords: ['saldo', 'quanto tenho', 'disponível'],
    response:
      'Seu saldo disponível hoje é de **R$ 880,00**. Desse valor, a projeção para o fim do mês é que sobrem **R$ 120,00** se você mantiver o ritmo atual.',
  },
]

export function findAIResponse(text: string): string {
  const lower = text.toLowerCase()
  const match = aiResponses.find((r) => r.keywords.some((k) => lower.includes(k)))
  return (
    match?.response ??
    'Analisando seus dados... Com base no seu padrão atual, você está dentro do planejamento. Posso te ajudar com algo mais específico?'
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/mock-data.ts
git commit -m "feat: add static mock data and findAIResponse"
```

---

## Task 5: Zustand AI chat store (TDD)

**Files:**
- Create: `src/store/__tests__/ai-chat.test.ts`
- Create: `src/store/ai-chat.ts`

- [ ] **Step 1: Write failing tests**

Create `src/store/__tests__/ai-chat.test.ts`:
```typescript
import { useAIChat } from '@/store/ai-chat'

describe('useAIChat store', () => {
  beforeEach(() => {
    useAIChat.setState({
      messages: [],
      isTyping: false,
    })
  })

  it('starts with isTyping false', () => {
    expect(useAIChat.getState().isTyping).toBe(false)
  })

  it('sendMessage adds user message immediately', () => {
    useAIChat.getState().sendMessage('Oi')
    const { messages } = useAIChat.getState()
    expect(messages).toHaveLength(1)
    expect(messages[0].role).toBe('user')
    expect(messages[0].content).toBe('Oi')
  })

  it('sendMessage sets isTyping to true while waiting', () => {
    useAIChat.getState().sendMessage('teste')
    expect(useAIChat.getState().isTyping).toBe(true)
  })

  it('sendMessage adds AI response after delay', async () => {
    jest.useFakeTimers()
    useAIChat.getState().sendMessage('saldo')
    jest.advanceTimersByTime(900)
    const { messages, isTyping } = useAIChat.getState()
    expect(messages).toHaveLength(2)
    expect(messages[1].role).toBe('ai')
    expect(isTyping).toBe(false)
    jest.useRealTimers()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- --testPathPattern=ai-chat
```
Expected: FAIL — `Cannot find module '@/store/ai-chat'`

- [ ] **Step 3: Create the Zustand store**

Create `src/store/ai-chat.ts`:
```typescript
import { create } from 'zustand'
import { findAIResponse } from '@/lib/mock-data'

export type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
}

type AIChatStore = {
  messages: Message[]
  isTyping: boolean
  sendMessage: (text: string) => void
}

export const useAIChat = create<AIChatStore>((set) => ({
  messages: [
    {
      id: 'init-user',
      role: 'user',
      content: 'Posso sair esse final de semana?',
    },
    {
      id: 'init-ai',
      role: 'ai',
      content:
        'Considerando seus gastos atuais, você tem **R$ 880,00** disponíveis. Se mantiver o ritmo, poderá gastar até **R$ 80,00** no fim de semana sem comprometer seu orçamento. Quer que eu simule para você?',
    },
  ],
  isTyping: false,
  sendMessage: (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }
    set((state) => ({ messages: [...state.messages, userMsg], isTyping: true }))
    setTimeout(() => {
      const response = findAIResponse(text)
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: response,
      }
      set((state) => ({ messages: [...state.messages, aiMsg], isTyping: false }))
    }, 800)
  },
}))
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- --testPathPattern=ai-chat
```
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Run all tests**

```bash
npm test
```
Expected: PASS — 11 tests pass total.

- [ ] **Step 6: Commit**

```bash
git add src/store/ai-chat.ts src/store/__tests__/ai-chat.test.ts
git commit -m "feat: add Zustand AI chat store with mock response matching"
```

---

## Task 6: useTypingEffect hook

**Files:**
- Create: `src/components/ai/useTypingEffect.ts`

- [ ] **Step 1: Create the hook**

Create `src/components/ai/useTypingEffect.ts`:
```typescript
import { useState, useEffect } from 'react'

export function useTypingEffect(text: string, speed = 18): string {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    if (!text) return

    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return displayed
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ai/useTypingEffect.ts
git commit -m "feat: add useTypingEffect hook for AI chat animation"
```

---

## Task 7: Root layout + AppShell

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create AppShell client component**

Create `src/components/layout/AppShell.tsx`:
```tsx
'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-bg">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update root layout**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/layout/AppShell'

export const metadata: Metadata = {
  title: 'Drakma — Suas finanças, sob controle',
  description: 'Plataforma financeira com IA para universitários',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Update root page to redirect**

Replace `src/app/page.tsx`:
```tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/components/layout/AppShell.tsx
git commit -m "feat: add AppShell with sidebar collapse state + root redirect"
```

---

## Task 8: Sidebar component

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/SidebarNav.tsx`

- [ ] **Step 1: Create SidebarNav**

Create `src/components/layout/SidebarNav.tsx`:
```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Tag,
  Sparkles,
  Target,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gastos', label: 'Gastos', icon: ArrowDownCircle },
  { href: '/receitas', label: 'Receitas', icon: ArrowUpCircle },
  { href: '/categorias', label: 'Categorias', icon: Tag },
  { href: '/insights', label: 'Insights IA', icon: Sparkles },
  { href: '/metas', label: 'Metas', icon: Target, soon: true },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

interface SidebarNavProps {
  isCollapsed: boolean
}

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map(({ href, label, icon: Icon, soon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={soon ? '#' : href}
            title={isCollapsed ? label : undefined}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors duration-150 group',
              isActive
                ? 'bg-gold-subtle text-gold'
                : 'text-sidebar-text hover:bg-sidebar-hover hover:text-surface-card',
              soon && 'opacity-50 cursor-default pointer-events-none'
            )}
          >
            <Icon
              size={16}
              className={cn('flex-shrink-0', isActive ? 'text-gold' : 'text-sidebar-muted group-hover:text-surface-card')}
            />
            {!isCollapsed && (
              <span className="text-[13px] font-medium leading-none whitespace-nowrap">
                {label}
              </span>
            )}
            {!isCollapsed && soon && (
              <span className="ml-auto text-[9px] bg-sidebar-surface text-sidebar-muted px-1.5 py-0.5 rounded-full">
                breve
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Create Sidebar**

Create `src/components/layout/Sidebar.tsx`:
```tsx
'use client'

import { ChevronLeft, ChevronRight, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import SidebarNav from './SidebarNav'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-sidebar-bg flex-shrink-0 transition-all duration-250 ease-in-out overflow-hidden',
        isCollapsed ? 'w-14' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-5 border-b border-sidebar-border">
        <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sidebar-bg text-sm">
          D
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="text-[13px] font-extrabold text-surface-card tracking-wide leading-none">
              DRAKMA
            </p>
            <p className="text-[10px] text-sidebar-muted mt-0.5">
              Suas finanças, sob controle.
            </p>
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="ml-auto flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-sidebar-muted hover:text-surface-card transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className="flex items-center justify-center py-2 text-sidebar-muted hover:text-surface-card transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

      {/* Footer */}
      <div className="px-2 pb-4 flex flex-col gap-2">
        {/* Premium card */}
        {!isCollapsed && (
          <div className="bg-sidebar-surface border border-[#C9A86A30] rounded-sidebar p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Crown size={12} className="text-gold" />
              <p className="text-[11px] font-bold text-gold">Drakma Premium</p>
            </div>
            <p className="text-[10px] text-sidebar-muted leading-[1.5] mb-2">
              Recursos avançados para você ir ainda mais longe.
            </p>
            <button className="w-full bg-gold text-sidebar-bg text-[10px] font-bold py-1.5 rounded-md hover:bg-gold-light transition-colors">
              Quero conhecer
            </button>
          </div>
        )}

        {/* User */}
        <div
          className={cn(
            'flex items-center gap-2 bg-sidebar-surface rounded-sidebar',
            isCollapsed ? 'p-1.5 justify-center' : 'px-2.5 py-2'
          )}
        >
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 text-sidebar-bg text-[13px] font-bold">
            L
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-surface-card">Lucas</p>
                <p className="text-[10px] text-sidebar-muted">Plano Gratuito</p>
              </div>
              <ChevronLeft size={12} className="text-sidebar-muted rotate-[-90deg]" />
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/components/layout/SidebarNav.tsx
git commit -m "feat: add collapsible Sidebar with nav, premium card and user footer"
```

---

## Task 9: TopHeader component

**Files:**
- Create: `src/components/layout/TopHeader.tsx`

- [ ] **Step 1: Create TopHeader**

Create `src/components/layout/TopHeader.tsx`:
```tsx
import { Bell, ChevronDown, Calendar, Plus } from 'lucide-react'

export default function TopHeader() {
  return (
    <header className="flex items-center justify-between px-7 py-5 bg-surface-card border-b border-surface-border flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">
          Olá, Lucas 👋
        </h1>
        <p className="text-[12px] text-ink-muted mt-0.5">
          Veja como estão suas finanças hoje.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Month selector */}
        <button className="flex items-center gap-2 bg-white border border-surface-border rounded-lg px-3 py-2 text-[12px] font-medium text-ink hover:bg-surface-hover transition-colors">
          <Calendar size={13} className="text-ink-muted" />
          Maio de 2024
          <ChevronDown size={12} className="text-ink-muted" />
        </button>

        {/* Notification */}
        <button className="w-[34px] h-[34px] bg-white border border-surface-border rounded-lg flex items-center justify-center hover:bg-surface-hover transition-colors">
          <Bell size={15} className="text-ink-muted" />
        </button>

        {/* Add expense */}
        <button className="flex items-center gap-2 bg-ink text-surface-card text-[12px] font-semibold px-4 py-2 rounded-lg hover:bg-sidebar-surface transition-colors">
          <Plus size={15} />
          Adicionar gasto
          <ChevronDown size={11} className="opacity-50" />
        </button>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/TopHeader.tsx
git commit -m "feat: add TopHeader with month selector and CTA button"
```

---

## Task 10: SummaryCards component

**Files:**
- Create: `src/components/dashboard/SummaryCards.tsx`

- [ ] **Step 1: Create SummaryCards**

Create `src/components/dashboard/SummaryCards.tsx`:
```tsx
import { Wallet, ShoppingBag, CreditCard, TrendingUp, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { financialSummary } from '@/lib/mock-data'

const cards = [
  {
    label: 'Receitas',
    key: 'receitas' as const,
    icon: Wallet,
    iconBg: 'bg-[#FFF8EE]',
    iconColor: 'text-gold',
    valueColor: 'text-gold',
    sub: 'Total recebido no mês',
  },
  {
    label: 'Gastos',
    key: 'gastos' as const,
    icon: ShoppingBag,
    iconBg: 'bg-[#FFF0F0]',
    iconColor: 'text-expense',
    valueColor: 'text-expense',
    sub: 'Total gasto no mês',
  },
  {
    label: 'Saldo disponível',
    key: 'saldo' as const,
    icon: CreditCard,
    iconBg: 'bg-[#F0F4FF]',
    iconColor: 'text-forecast',
    valueColor: 'text-ink',
    sub: 'Disponível para usar',
  },
  {
    label: 'Previsão para o mês',
    key: 'previsao' as const,
    icon: TrendingUp,
    iconBg: 'bg-[#F0FFF8]',
    iconColor: 'text-positive',
    valueColor: 'text-forecast',
    sub: 'Saldo previsto no fim do mês',
    hasInfo: true,
  },
]

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        const value = financialSummary[card.key]
        return (
          <div
            key={card.key}
            className="bg-surface-card rounded-card p-4 shadow-card hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-[22px] h-[22px] ${card.iconBg} rounded-md flex items-center justify-center flex-shrink-0`}>
                <Icon size={12} className={card.iconColor} />
              </div>
              <span className="text-[11px] text-ink-muted font-medium">{card.label}</span>
              {card.hasInfo && (
                <Info size={11} className="text-ink-muted ml-auto cursor-pointer" />
              )}
            </div>
            <p className={`text-[22px] font-bold tracking-tight leading-none ${card.valueColor}`}>
              {formatCurrency(value)}
            </p>
            <p className="text-[10px] text-ink-muted mt-1.5">{card.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/SummaryCards.tsx
git commit -m "feat: add SummaryCards with 4 financial metrics"
```

---

## Task 11: CategoryChart (Recharts donut)

**Files:**
- Create: `src/components/dashboard/CategoryChart.tsx`

- [ ] **Step 1: Create CategoryChart**

Create `src/components/dashboard/CategoryChart.tsx`:
```tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { categories } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export default function CategoryChart() {
  const total = categories.reduce((sum, c) => sum + c.value, 0)

  return (
    <div className="bg-surface-card rounded-card p-5 shadow-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-ink">Gastos por categoria</h3>
        <button className="text-[10px] text-ink-muted flex items-center gap-1 hover:text-ink transition-colors">
          Este mês
          <span className="text-[9px]">▾</span>
        </button>
      </div>

      {/* Donut chart */}
      <div className="flex items-center justify-center my-4">
        <div className="relative w-[130px] h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={62}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {categories.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[13px] font-bold text-ink leading-none">
              {formatCurrency(total)}
            </span>
            <span className="text-[9px] text-ink-muted mt-0.5">Total gasto</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-[2px] flex-shrink-0"
                style={{ background: cat.color }}
              />
              <span className="text-[11px] text-ink-faint">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-ink">
                {formatCurrency(cat.value)}
              </span>
              <span className="text-[10px] text-ink-muted w-7 text-right">
                {cat.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-surface-muted">
        <button className="w-full text-[11px] text-gold text-center hover:text-gold-light transition-colors">
          Ver relatório completo →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/CategoryChart.tsx
git commit -m "feat: add CategoryChart with Recharts donut and legend"
```

---

## Task 12: InsightCard + InsightBanner

**Files:**
- Create: `src/components/insights/InsightCard.tsx`
- Create: `src/components/dashboard/InsightBanner.tsx`

- [ ] **Step 1: Create InsightCard**

Create `src/components/insights/InsightCard.tsx`:
```tsx
import { cn } from '@/lib/utils'

interface InsightCardProps {
  icon: string
  text: string
  highlight: string
  className?: string
}

export default function InsightCard({ icon, text, highlight, className }: InsightCardProps) {
  const parts = text.split('{highlight}')
  return (
    <div className={cn('bg-[#242428] rounded-lg p-3', className)}>
      <div className="text-base mb-1.5">{icon}</div>
      <p className="text-[11px] text-[#D0D0D8] leading-[1.5]">
        {parts[0]}
        <strong className="text-gold">{highlight}</strong>
        {parts[1]}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create InsightBanner**

Create `src/components/dashboard/InsightBanner.tsx`:
```tsx
import { Sparkles } from 'lucide-react'
import { insights } from '@/lib/mock-data'
import InsightCard from '@/components/insights/InsightCard'

export default function InsightBanner() {
  return (
    <div className="bg-sidebar-bg rounded-card p-5 shadow-card flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-gold" />
        <h3 className="text-[12px] font-bold text-gold tracking-wide">
          Insights do Drakma
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            icon={insight.icon}
            text={insight.text}
            highlight={insight.highlight}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/insights/InsightCard.tsx src/components/dashboard/InsightBanner.tsx
git commit -m "feat: add InsightCard and InsightBanner components"
```

---

## Task 13: RecentExpenses component

**Files:**
- Create: `src/components/dashboard/RecentExpenses.tsx`

- [ ] **Step 1: Create RecentExpenses**

Create `src/components/dashboard/RecentExpenses.tsx`:
```tsx
import { recentExpenses } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function RecentExpenses() {
  return (
    <div className="bg-surface-card rounded-card p-5 shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-ink">Gastos recentes</h3>
        <button className="text-[11px] text-gold hover:text-gold-light transition-colors">
          Ver todos
        </button>
      </div>

      <div className="flex flex-col divide-y divide-surface-muted flex-1">
        {recentExpenses.map((expense) => (
          <div key={expense.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="w-7 h-7 bg-surface-hover rounded-lg flex items-center justify-center flex-shrink-0 text-sm">
              {expense.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-ink leading-none">
                {expense.name}
              </p>
              <p className="text-[10px] text-ink-muted mt-0.5">
                {formatDate(expense.date)}
              </p>
            </div>
            <span className="text-[12px] font-semibold text-expense flex-shrink-0">
              {formatCurrency(expense.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-surface-muted">
        <button className="w-full text-[11px] text-gold text-center hover:text-gold-light transition-colors">
          Ver todos os gastos →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/RecentExpenses.tsx
git commit -m "feat: add RecentExpenses component"
```

---

## Task 14: AIAssistant component

**Files:**
- Create: `src/components/ai/AIAssistant.tsx`

- [ ] **Step 1: Create AIAssistant**

Create `src/components/ai/AIAssistant.tsx`:
```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { useAIChat } from '@/store/ai-chat'
import { useTypingEffect } from './useTypingEffect'
import { cn } from '@/lib/utils'

function parseMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-gold font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function TypingMessage({ content }: { content: string }) {
  const displayed = useTypingEffect(content)
  return <>{parseMarkdown(displayed)}</>
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-sidebar-muted rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const { messages, isTyping, sendMessage } = useAIChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastAiIndex = [...messages].reverse().findIndex((m) => m.role === 'ai')
  const lastAiId = lastAiIndex >= 0 ? messages[messages.length - 1 - lastAiIndex].id : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput('')
    sendMessage(text)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-[#2A2A31] rounded-card p-4 flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Sparkles size={13} className="text-gold" />
        <span className="text-[12px] font-bold text-gold">Assistente IA</span>
        <span className="text-[9px] bg-[rgba(201,168,106,0.15)] text-gold px-1.5 py-0.5 rounded-full">
          BETA
        </span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-gold text-sidebar-bg text-[11px] font-medium px-3 py-2 rounded-[10px_10px_2px_10px] max-w-[80%] leading-[1.4]">
                  {msg.content}
                </div>
              </div>
            )
          }
          return (
            <div key={msg.id} className="flex gap-2 items-start">
              <div className="w-[22px] h-[22px] bg-sidebar-bg rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
                🤖
              </div>
              <div className="bg-[#363640] text-[#D0D0D8] text-[11px] px-3 py-2 rounded-[10px_10px_10px_2px] flex-1 leading-[1.5]">
                {msg.id === lastAiId && !isTyping
                  ? <TypingMessage content={msg.content} />
                  : parseMarkdown(msg.content)}
              </div>
            </div>
          )
        })}
        {isTyping && (
          <div className="flex gap-2 items-start">
            <div className="w-[22px] h-[22px] bg-sidebar-bg rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
              🤖
            </div>
            <div className="bg-[#363640] px-3 py-2 rounded-[10px_10px_10px_2px]">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 bg-[#363640] rounded-lg px-3 py-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte algo..."
          className="flex-1 bg-transparent text-[11px] text-[#D0D0D8] placeholder:text-sidebar-muted outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
            input.trim()
              ? 'bg-gold text-sidebar-bg hover:bg-gold-light'
              : 'bg-sidebar-surface text-sidebar-muted cursor-not-allowed'
          )}
        >
          <Send size={11} />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ai/AIAssistant.tsx
git commit -m "feat: add AIAssistant with typing animation and mock chat"
```

---

## Task 15: BentoGrid + Dashboard page

**Files:**
- Create: `src/components/dashboard/BentoGrid.tsx`
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create BentoGrid**

Create `src/components/dashboard/BentoGrid.tsx`:
```tsx
import CategoryChart from './CategoryChart'
import InsightBanner from './InsightBanner'
import RecentExpenses from './RecentExpenses'
import AIAssistant from '@/components/ai/AIAssistant'

export default function BentoGrid() {
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: '1fr 1.4fr 1fr',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      {/* CategoryChart spans 2 rows */}
      <div style={{ gridRow: 'span 2' }}>
        <CategoryChart />
      </div>

      {/* InsightBanner spans 2 cols, row 1 */}
      <div style={{ gridColumn: 'span 2' }}>
        <InsightBanner />
      </div>

      {/* RecentExpenses col 2, row 2 */}
      <RecentExpenses />

      {/* AIAssistant col 3, row 2 */}
      <AIAssistant />
    </div>
  )
}
```

- [ ] **Step 2: Create Dashboard page**

Create `src/app/dashboard/page.tsx`:
```tsx
import { Shield } from 'lucide-react'
import TopHeader from '@/components/layout/TopHeader'
import SummaryCards from '@/components/dashboard/SummaryCards'
import BentoGrid from '@/components/dashboard/BentoGrid'

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopHeader />
      <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-4">
        <SummaryCards />
        <BentoGrid />
        {/* Security bar */}
        <div className="flex items-center gap-2 pb-2">
          <div className="w-[18px] h-[18px] bg-ink rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={10} className="text-gold" />
          </div>
          <p className="text-[10px] text-ink-muted">
            <strong className="text-ink-faint">Seus dados estão seguros com a gente.</strong>{' '}
            O Drakma não compartilha suas informações com terceiros.
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/BentoGrid.tsx src/app/dashboard/page.tsx
git commit -m "feat: compose BentoGrid and Dashboard page"
```

---

## Task 16: Stub pages

**Files:**
- Create: `src/app/gastos/page.tsx`
- Create: `src/app/receitas/page.tsx`
- Create: `src/app/insights/page.tsx`
- Create: `src/app/configuracoes/page.tsx`

- [ ] **Step 1: Create stub pages**

Create `src/app/gastos/page.tsx`:
```tsx
import TopHeader from '@/components/layout/TopHeader'

export default function GastosPage() {
  return (
    <div className="flex flex-col h-full">
      <TopHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">💸</p>
          <h2 className="text-xl font-semibold text-ink mb-1">Gastos</h2>
          <p className="text-sm text-ink-muted">Em desenvolvimento</p>
        </div>
      </div>
    </div>
  )
}
```

Create `src/app/receitas/page.tsx`:
```tsx
import TopHeader from '@/components/layout/TopHeader'

export default function ReceitasPage() {
  return (
    <div className="flex flex-col h-full">
      <TopHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">💰</p>
          <h2 className="text-xl font-semibold text-ink mb-1">Receitas</h2>
          <p className="text-sm text-ink-muted">Em desenvolvimento</p>
        </div>
      </div>
    </div>
  )
}
```

Create `src/app/insights/page.tsx`:
```tsx
import TopHeader from '@/components/layout/TopHeader'

export default function InsightsPage() {
  return (
    <div className="flex flex-col h-full">
      <TopHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">✦</p>
          <h2 className="text-xl font-semibold text-ink mb-1">Insights IA</h2>
          <p className="text-sm text-ink-muted">Em desenvolvimento</p>
        </div>
      </div>
    </div>
  )
}
```

Create `src/app/configuracoes/page.tsx`:
```tsx
import TopHeader from '@/components/layout/TopHeader'

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col h-full">
      <TopHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">⚙️</p>
          <h2 className="text-xl font-semibold text-ink mb-1">Configurações</h2>
          <p className="text-sm text-ink-muted">Em desenvolvimento</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/gastos/page.tsx src/app/receitas/page.tsx src/app/insights/page.tsx src/app/configuracoes/page.tsx
git commit -m "feat: add stub pages for gastos, receitas, insights, configuracoes"
```

---

## Task 17: Final verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```
Expected: PASS — 11 tests pass.

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```
Open `http://localhost:3000`. Verify:
- Redirects to `/dashboard`
- Sidebar is visible with all nav items (no Relatórios)
- Clicking chevron collapses/expands sidebar with animation
- 4 summary cards show correct values and colors
- Donut chart renders with legend
- Insight banner shows 3 dark cards
- Recent expenses list shows 5 items
- AI chat shows initial conversation
- Typing a message triggers typing indicator, then AI response with animation
- Nav links to gastos, receitas, insights, configuracoes show stub pages

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Drakma Dashboard MVP"
```
