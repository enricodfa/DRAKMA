# Drakma — Dados Reais com Supabase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all mock data with real Supabase data — gastos and receitas fully functional with CRUD, dashboard showing aggregated real data.

**Architecture:** Client-side data fetching via custom hooks (`useGastos`, `useReceitas`) using the Supabase browser client. Pages fetch data at the top level and pass it as props to child display components. Modals handle create/edit forms. Row Level Security ensures each user only sees their own data.

**Tech Stack:** Next.js 16 App Router, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), TypeScript, Recharts, Tailwind CSS v4

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/supabase/queries.ts` | Create | All DB query functions (get, create, update, delete) |
| `src/lib/categories.ts` | Create | Shared category/method constants |
| `src/hooks/useGastos.ts` | Create | Gastos CRUD hook with optimistic state |
| `src/hooks/useReceitas.ts` | Create | Receitas CRUD hook with optimistic state |
| `src/components/ui/Modal.tsx` | Create | Reusable modal wrapper |
| `src/components/gastos/AdicionarGastoModal.tsx` | Create | Form modal for creating/editing gastos |
| `src/components/receitas/AdicionarReceitaModal.tsx` | Create | Form modal for creating/editing receitas |
| `src/components/gastos/GastosStatCards.tsx` | Modify | Accept `gastos` prop instead of mock data |
| `src/components/gastos/GastosTable.tsx` | Modify | Accept `gastos`, `onDelete`, `onEdit` props |
| `src/components/gastos/GastosRightPanel.tsx` | Modify | Accept `gastos` prop, compute charts from it |
| `src/app/gastos/page.tsx` | Modify | Use `useGastos`, pass data to components, open modal |
| `src/components/receitas/ReceitasStatCards.tsx` | Modify | Accept `receitas` prop |
| `src/components/receitas/ReceitasTable.tsx` | Modify | Accept `receitas`, `onDelete`, `onEdit` props |
| `src/components/receitas/ReceitasCategoryChart.tsx` | Modify | Accept `receitas` prop |
| `src/components/receitas/ReceitasLineChart.tsx` | Modify | Accept `monthlyData` prop |
| `src/components/receitas/ReceitasSummary.tsx` | Modify | Accept `receitas`, `totalGastos` props |
| `src/app/receitas/page.tsx` | Modify | Use `useReceitas`, pass data, open modal |
| `src/components/dashboard/SummaryCards.tsx` | Modify | Accept `summary` prop |
| `src/components/dashboard/CategoryChart.tsx` | Modify | Accept `gastos` prop, compute categories |
| `src/components/dashboard/RecentExpenses.tsx` | Modify | Accept `gastos` prop |
| `src/app/dashboard/page.tsx` | Modify | Fetch real data, pass to components |

---

## Task 1: Supabase Schema (Manual — run in Supabase SQL Editor)

**Files:** None (run SQL directly in Supabase dashboard → SQL Editor)

- [ ] **Step 1: Open Supabase SQL Editor**

Go to your Supabase project → SQL Editor → New query. Paste and run:

```sql
-- ==================== GASTOS ====================
create table public.gastos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric(10,2) not null default 0,
  category text not null,
  date date not null,
  method text not null default 'pix',
  icon text not null default '💰',
  created_at timestamptz default now()
);

alter table public.gastos enable row level security;

create policy "select_own_gastos" on public.gastos
  for select using (auth.uid() = user_id);
create policy "insert_own_gastos" on public.gastos
  for insert with check (auth.uid() = user_id);
create policy "update_own_gastos" on public.gastos
  for update using (auth.uid() = user_id);
create policy "delete_own_gastos" on public.gastos
  for delete using (auth.uid() = user_id);

-- ==================== RECEITAS ====================
create table public.receitas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric(10,2) not null default 0,
  category text not null,
  date date not null,
  method text not null default 'pix',
  icon text not null default '💵',
  created_at timestamptz default now()
);

alter table public.receitas enable row level security;

create policy "select_own_receitas" on public.receitas
  for select using (auth.uid() = user_id);
create policy "insert_own_receitas" on public.receitas
  for insert with check (auth.uid() = user_id);
create policy "update_own_receitas" on public.receitas
  for update using (auth.uid() = user_id);
create policy "delete_own_receitas" on public.receitas
  for delete using (auth.uid() = user_id);
```

- [ ] **Step 2: Verify tables exist**

In Supabase → Table Editor, confirm `gastos` and `receitas` tables appear with correct columns.

---

## Task 2: Categories constants + Query types and functions

**Files:**
- Create: `src/lib/categories.ts`
- Create: `src/lib/supabase/queries.ts`

- [ ] **Step 1: Create `src/lib/categories.ts`**

```typescript
export const GASTOS_CATEGORIES = [
  'Alimentação', 'Transporte', 'Delivery', 'Lazer',
  'Estudos', 'Saúde', 'Outros',
] as const

export const GASTOS_METHODS = ['pix', 'visa', 'mastercard'] as const

export const RECEITAS_CATEGORIES = [
  'Bolsa de Estudos', 'Trabalho', 'Ajuda dos pais', 'Outros',
] as const

export const RECEITAS_METHODS = ['pix', 'transferencia', 'ted', 'deposito'] as const

export const CATEGORY_ICON: Record<string, string> = {
  'Alimentação': '🍽️',
  'Transporte': '🚗',
  'Delivery': '🛵',
  'Lazer': '🎮',
  'Estudos': '📚',
  'Saúde': '💊',
  'Bolsa de Estudos': '🎓',
  'Trabalho': '💼',
  'Ajuda dos pais': '👨‍👩‍👧',
  'Outros': '•••',
}

export const METHOD_LABEL: Record<string, string> = {
  pix: 'PIX',
  visa: 'Visa',
  mastercard: 'Mastercard',
  transferencia: 'Transferência',
  ted: 'TED',
  deposito: 'Depósito',
}
```

- [ ] **Step 2: Create `src/lib/supabase/queries.ts`**

```typescript
import { createClient } from './client'

export type Gasto = {
  id: string
  user_id: string
  name: string
  amount: number
  category: string
  date: string
  method: string
  icon: string
  created_at: string
}

export type Receita = {
  id: string
  user_id: string
  name: string
  amount: number
  category: string
  date: string
  method: string
  icon: string
  created_at: string
}

export type GastoInput = Omit<Gasto, 'id' | 'created_at'>
export type ReceitaInput = Omit<Receita, 'id' | 'created_at'>

// ─── GASTOS ───────────────────────────────────────────────────
export async function fetchGastos(): Promise<Gasto[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertGasto(input: GastoInput): Promise<Gasto> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('gastos')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function patchGasto(id: string, updates: Partial<GastoInput>): Promise<Gasto> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('gastos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeGasto(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('gastos').delete().eq('id', id)
  if (error) throw error
}

// ─── RECEITAS ─────────────────────────────────────────────────
export async function fetchReceitas(): Promise<Receita[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('receitas')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertReceita(input: ReceitaInput): Promise<Receita> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('receitas')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function patchReceita(id: string, updates: Partial<ReceitaInput>): Promise<Receita> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('receitas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeReceita(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('receitas').delete().eq('id', id)
  if (error) throw error
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/categories.ts src/lib/supabase/queries.ts
git commit -m "feat: Supabase query functions and category constants"
```

---

## Task 3: useGastos and useReceitas hooks

**Files:**
- Create: `src/hooks/useGastos.ts`
- Create: `src/hooks/useReceitas.ts`

- [ ] **Step 1: Create `src/hooks/useGastos.ts`**

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  fetchGastos, insertGasto, patchGasto, removeGasto,
  type Gasto, type GastoInput,
} from '@/lib/supabase/queries'

export function useGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await fetchGastos()
      setGastos(data)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (input: Omit<GastoInput, 'user_id'>) => {
    if (!userId) return
    const created = await insertGasto({ ...input, user_id: userId })
    setGastos(prev => [created, ...prev])
    return created
  }, [userId])

  const update = useCallback(async (id: string, updates: Partial<GastoInput>) => {
    const updated = await patchGasto(id, updates)
    setGastos(prev => prev.map(g => g.id === id ? updated : g))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await removeGasto(id)
    setGastos(prev => prev.filter(g => g.id !== id))
  }, [])

  return { gastos, loading, add, update, remove }
}
```

- [ ] **Step 2: Create `src/hooks/useReceitas.ts`**

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  fetchReceitas, insertReceita, patchReceita, removeReceita,
  type Receita, type ReceitaInput,
} from '@/lib/supabase/queries'

export function useReceitas() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await fetchReceitas()
      setReceitas(data)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (input: Omit<ReceitaInput, 'user_id'>) => {
    if (!userId) return
    const created = await insertReceita({ ...input, user_id: userId })
    setReceitas(prev => [created, ...prev])
    return created
  }, [userId])

  const update = useCallback(async (id: string, updates: Partial<ReceitaInput>) => {
    const updated = await patchReceita(id, updates)
    setReceitas(prev => prev.map(r => r.id === id ? updated : r))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await removeReceita(id)
    setReceitas(prev => prev.filter(r => r.id !== id))
  }, [])

  return { receitas, loading, add, update, remove }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useGastos.ts src/hooks/useReceitas.ts
git commit -m "feat: useGastos and useReceitas hooks"
```

---

## Task 4: Modal base component

**Files:**
- Create: `src/components/ui/Modal.tsx`

- [ ] **Step 1: Create `src/components/ui/Modal.tsx`**

```typescript
'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
}

export default function Modal({ title, onClose, children, width = 480 }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full rounded-2xl flex flex-col"
        style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', maxWidth: width }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#2A2A38' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>{title}</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Modal.tsx
git commit -m "feat: reusable Modal component"
```

---

## Task 5: AdicionarGastoModal

**Files:**
- Create: `src/components/gastos/AdicionarGastoModal.tsx`

- [ ] **Step 1: Create `src/components/gastos/AdicionarGastoModal.tsx`**

```typescript
'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { GASTOS_CATEGORIES, GASTOS_METHODS, CATEGORY_ICON, METHOD_LABEL } from '@/lib/categories'
import type { GastoInput } from '@/lib/supabase/queries'

type Props = {
  onClose: () => void
  onAdd: (input: Omit<GastoInput, 'user_id'>) => Promise<unknown>
  initial?: Omit<GastoInput, 'user_id'> & { id?: string }
}

const inputStyle = {
  width: '100%',
  backgroundColor: '#0F0F15',
  border: '1px solid #2A2A38',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#D0D0D8',
  fontSize: 13,
  outline: 'none',
}

const labelStyle = { display: 'block', fontSize: 11, color: '#6B6B80', marginBottom: 6 }

export default function AdicionarGastoModal({ onClose, onAdd, initial }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    amount: initial?.amount?.toString() ?? '',
    category: initial?.category ?? GASTOS_CATEGORIES[0],
    date: initial?.date ?? today,
    method: initial?.method ?? 'pix',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Informe a descrição'); return }
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount < 0) { setError('Valor inválido'); return }
    setSaving(true)
    try {
      await onAdd({
        name: form.name.trim(),
        amount,
        category: form.category,
        date: form.date,
        method: form.method,
        icon: CATEGORY_ICON[form.category] ?? '💰',
      })
      onClose()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Adicionar gasto" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label style={labelStyle}>Descrição</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ex: iFood - Almoço"
            style={inputStyle}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>Valor (R$)</label>
            <input
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0,00"
              style={inputStyle}
              inputMode="decimal"
            />
          </div>
          <div>
            <label style={labelStyle}>Data</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Categoria</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {GASTOS_CATEGORIES.map(c => (
              <option key={c} value={c}>{CATEGORY_ICON[c]} {c}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Método de pagamento</label>
          <select
            value={form.method}
            onChange={e => set('method', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {GASTOS_METHODS.map(m => (
              <option key={m} value={m}>{METHOD_LABEL[m]}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs" style={{ color: '#E05C5C' }}>{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#1E1E28', color: '#9090A0', border: '1px solid #2A2A38' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            {saving ? 'Salvando...' : 'Salvar gasto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/gastos/AdicionarGastoModal.tsx
git commit -m "feat: AdicionarGastoModal form"
```

---

## Task 6: AdicionarReceitaModal

**Files:**
- Create: `src/components/receitas/AdicionarReceitaModal.tsx`

- [ ] **Step 1: Create `src/components/receitas/AdicionarReceitaModal.tsx`**

```typescript
'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { RECEITAS_CATEGORIES, RECEITAS_METHODS, CATEGORY_ICON, METHOD_LABEL } from '@/lib/categories'
import type { ReceitaInput } from '@/lib/supabase/queries'

type Props = {
  onClose: () => void
  onAdd: (input: Omit<ReceitaInput, 'user_id'>) => Promise<unknown>
}

const inputStyle = {
  width: '100%',
  backgroundColor: '#0F0F15',
  border: '1px solid #2A2A38',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#D0D0D8',
  fontSize: 13,
  outline: 'none',
}

const labelStyle = { display: 'block', fontSize: 11, color: '#6B6B80', marginBottom: 6 }

export default function AdicionarReceitaModal({ onClose, onAdd }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    name: '',
    amount: '',
    category: RECEITAS_CATEGORIES[0],
    date: today,
    method: 'pix',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Informe a descrição'); return }
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount < 0) { setError('Valor inválido'); return }
    setSaving(true)
    try {
      await onAdd({
        name: form.name.trim(),
        amount,
        category: form.category,
        date: form.date,
        method: form.method,
        icon: CATEGORY_ICON[form.category] ?? '💵',
      })
      onClose()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Adicionar receita" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label style={labelStyle}>Descrição</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ex: Bolsa de Estudos"
            style={inputStyle}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>Valor (R$)</label>
            <input
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0,00"
              style={inputStyle}
              inputMode="decimal"
            />
          </div>
          <div>
            <label style={labelStyle}>Data</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Categoria</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {RECEITAS_CATEGORIES.map(c => (
              <option key={c} value={c}>{CATEGORY_ICON[c]} {c}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Método</label>
          <select
            value={form.method}
            onChange={e => set('method', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {RECEITAS_METHODS.map(m => (
              <option key={m} value={m}>{METHOD_LABEL[m]}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs" style={{ color: '#E05C5C' }}>{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#1E1E28', color: '#9090A0', border: '1px solid #2A2A38' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            {saving ? 'Salvando...' : 'Salvar receita'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/receitas/AdicionarReceitaModal.tsx
git commit -m "feat: AdicionarReceitaModal form"
```

---

## Task 7: Gastos page with real data

**Files:**
- Modify: `src/components/gastos/GastosStatCards.tsx`
- Modify: `src/components/gastos/GastosTable.tsx`
- Modify: `src/components/gastos/GastosRightPanel.tsx`
- Modify: `src/app/gastos/page.tsx`

- [ ] **Step 1: Rewrite `src/components/gastos/GastosStatCards.tsx`**

```typescript
import { formatCurrency } from '@/lib/utils'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function GastosStatCards({ gastos }: Props) {
  const total = gastos.reduce((sum, g) => sum + g.amount, 0)
  const count = gastos.length
  const daily = count > 0 ? total / 30 : 0
  const max = gastos.reduce((m, g) => g.amount > m.amount ? g : m, gastos[0] ?? { amount: 0, name: '—' })

  const cards = [
    {
      label: 'Total de gastos',
      value: formatCurrency(total),
      sub: `${count} transações`,
      color: '#E05C5C',
    },
    {
      label: 'Média diária',
      value: formatCurrency(daily),
      sub: 'Últimos 30 dias',
      color: '#9090A0',
    },
    {
      label: 'Maior gasto',
      value: formatCurrency(max?.amount ?? 0),
      sub: max?.name ?? '—',
      color: '#F0F0F5',
    },
    {
      label: 'Transações',
      value: String(count),
      sub: 'Este mês',
      color: '#5B8DEF',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl p-4"
          style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
        >
          <p className="text-xs mb-2" style={{ color: '#9090A0' }}>{card.label}</p>
          <p className="text-xl font-bold tabular-nums" style={{ color: card.color }}>
            {card.value}
          </p>
          <p className="text-[11px] mt-1 truncate" style={{ color: '#6B6B80' }}>{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `src/components/gastos/GastosTable.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { Search, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { categoryColors } from '@/lib/mock-data'
import { METHOD_LABEL } from '@/lib/categories'
import type { Gasto } from '@/lib/supabase/queries'

const PAGE_SIZE = 10

type Props = {
  gastos: Gasto[]
  onDelete: (id: string) => void
}

export default function GastosTable({ gastos, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [page, setPage] = useState(1)

  const categories = ['Todas', ...Array.from(new Set(gastos.map(g => g.category)))]

  const filtered = gastos.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todas' || g.category === category
    return matchSearch && matchCat
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="rounded-xl flex flex-col" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #2A2A38' }}>
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38' }}
        >
          <Search size={13} style={{ color: '#6B6B80' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar gasto..."
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: '#D0D0D8' }}
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="text-xs px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Column headers */}
      <div
        className="grid text-[11px] px-5 py-2"
        style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr', color: '#6B6B80', borderBottom: '1px solid #2A2A38' }}
      >
        <span>Descrição</span><span>Categoria</span><span>Data</span>
        <span>Valor</span><span>Método</span><span>Ações</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {paged.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: '#6B6B80' }}>
            {gastos.length === 0 ? 'Nenhum gasto ainda. Adicione seu primeiro!' : 'Nenhum resultado.'}
          </p>
        ) : paged.map((g, i) => {
          const colors = categoryColors[g.category] ?? { text: '#9090A0', bg: 'rgba(144,144,160,0.12)' }
          return (
            <div
              key={g.id}
              className="grid items-center px-5 py-3 text-xs"
              style={{
                gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr',
                borderTop: i > 0 ? '1px solid #1E1E28' : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{g.icon}</span>
                <span style={{ color: '#D0D0D8' }}>{g.name}</span>
              </div>
              <span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ color: colors.text, backgroundColor: colors.bg }}>
                  {g.category}
                </span>
              </span>
              <span style={{ color: '#9090A0' }}>
                {new Date(g.date + 'T12:00:00').toLocaleDateString('pt-BR')}
              </span>
              <span className="font-semibold tabular-nums" style={{ color: '#E05C5C' }}>
                -{formatCurrency(g.amount)}
              </span>
              <span style={{ color: '#9090A0' }}>{METHOD_LABEL[g.method] ?? g.method}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => onDelete(g.id)} className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-5 py-3 text-xs"
        style={{ borderTop: '1px solid #2A2A38', color: '#6B6B80' }}
      >
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="disabled:opacity-40 hover:opacity-70">
          ← Anterior
        </button>
        <span style={{ color: '#C9A86A' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="disabled:opacity-40 hover:opacity-70">
          Próximo →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `src/components/gastos/GastosRightPanel.tsx`**

```typescript
'use client'

import { PieChart, Pie, Cell, Label, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { Gasto } from '@/lib/supabase/queries'

const COLORS = ['#C9A86A', '#E05C5C', '#4B9B7A', '#8B7EC8', '#5B8DEF', '#D0D0D8']

type Props = { gastos: Gasto[] }

export default function GastosRightPanel({ gastos }: Props) {
  // Category breakdown
  const categoryMap: Record<string, number> = {}
  gastos.forEach(g => {
    categoryMap[g.category] = (categoryMap[g.category] ?? 0) + g.amount
  })
  const total = Object.values(categoryMap).reduce((s, v) => s + v, 0)
  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length],
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))

  // Monthly breakdown (last 6 months)
  const monthMap: Record<string, number> = {}
  gastos.forEach(g => {
    const d = new Date(g.date + 'T12:00:00')
    const key = d.toLocaleDateString('pt-BR', { month: 'short' })
    monthMap[key] = (monthMap[key] ?? 0) + g.amount
  })
  const monthlyData = Object.entries(monthMap).slice(-6).map(([month, value]) => ({ month, value }))

  function CenterLabel() {
    return (
      <g>
        <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 16, fontWeight: 700, fill: '#F0F0F5' }}>
          {formatCurrency(total)}
        </text>
        <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 10, fill: '#6B6B80' }}>
          Total gasto
        </text>
      </g>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Donut */}
      <div className="rounded-xl p-4" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: '#F0F0F5' }}>Gastos por categoria</p>
        {categories.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: '#6B6B80' }}>Sem dados ainda</p>
        ) : (
          <>
            <div className="flex justify-center">
              <PieChart width={160} height={160}>
                <Pie data={categories} dataKey="value" cx="50%" cy="50%"
                  innerRadius={50} outerRadius={72} startAngle={90} endAngle={-270} strokeWidth={0}>
                  {categories.map(cat => <Cell key={cat.name} fill={cat.color} />)}
                  <Label content={<CenterLabel />} position="center" />
                </Pie>
              </PieChart>
            </div>
            <div className="flex flex-col gap-1.5 mt-3">
              {categories.map(cat => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs flex-1" style={{ color: '#9090A0' }}>{cat.name}</span>
                  <span className="text-xs font-medium tabular-nums" style={{ color: '#D0D0D8' }}>{formatCurrency(cat.value)}</span>
                  <span className="text-[11px] w-8 text-right" style={{ color: '#6B6B80' }}>{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bar chart */}
      {monthlyData.length > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#F0F0F5' }}>Evolução mensal</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [formatCurrency(Number(v)), 'Gastos']}
                contentStyle={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', borderRadius: 8, fontSize: 11 }}
              />
              <Bar dataKey="value" fill="#C9A86A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `src/app/gastos/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { CalendarDays, ChevronDown, Plus } from 'lucide-react'
import { useGastos } from '@/hooks/useGastos'
import GastosStatCards from '@/components/gastos/GastosStatCards'
import GastosTable from '@/components/gastos/GastosTable'
import GastosRightPanel from '@/components/gastos/GastosRightPanel'
import AdicionarGastoModal from '@/components/gastos/AdicionarGastoModal'

export default function GastosPage() {
  const { gastos, loading, add, remove } = useGastos()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <header
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: '#1E1E28' }}
      >
        <div>
          <h1 className="text-base font-semibold" style={{ color: '#F0F0F5' }}>Gastos</h1>
          <p className="text-xs" style={{ color: '#6B6B80' }}>Acompanhe e gerencie todos os seus gastos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', color: '#D0D0D8' }}
          >
            <CalendarDays size={13} style={{ color: '#9090A0' }} />
            {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            <ChevronDown size={12} style={{ color: '#6B6B80' }} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}
          >
            <Plus size={13} />
            Adicionar gasto
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 flex flex-col gap-5">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#6B6B80' }}>Carregando...</p>
          </div>
        ) : (
          <>
            <GastosStatCards gastos={gastos} />
            <div className="flex gap-4 flex-1" style={{ minHeight: 0 }}>
              <div className="flex-1 min-w-0">
                <GastosTable gastos={gastos} onDelete={remove} />
              </div>
              <div className="flex-shrink-0" style={{ width: 320 }}>
                <GastosRightPanel gastos={gastos} />
              </div>
            </div>
          </>
        )}
      </main>

      {showModal && (
        <AdicionarGastoModal
          onClose={() => setShowModal(false)}
          onAdd={add}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/gastos/ src/app/gastos/page.tsx
git commit -m "feat: gastos page with real Supabase data and modal"
```

---

## Task 8: Receitas page with real data

**Files:**
- Modify: `src/components/receitas/ReceitasStatCards.tsx`
- Modify: `src/components/receitas/ReceitasCategoryChart.tsx`
- Modify: `src/components/receitas/ReceitasLineChart.tsx`
- Modify: `src/components/receitas/ReceitasTable.tsx`
- Modify: `src/components/receitas/ReceitasSummary.tsx`
- Modify: `src/app/receitas/page.tsx`

- [ ] **Step 1: Rewrite `src/components/receitas/ReceitasStatCards.tsx`**

```typescript
import { Wallet, TrendingUp, Star, ArrowUpDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Receita } from '@/lib/supabase/queries'

type Props = { receitas: Receita[] }

export default function ReceitasStatCards({ receitas }: Props) {
  const total = receitas.reduce((sum, r) => sum + r.amount, 0)
  const count = receitas.length
  const avg = count > 0 ? total / 3 : 0
  const max = receitas.reduce((m, r) => r.amount > m.amount ? r : m, receitas[0] ?? { amount: 0, name: '—' })

  const cards = [
    { label: 'Total de receitas', value: formatCurrency(total), sub: `${count} entradas`, icon: Wallet, iconColor: '#4B9B7A', highlight: false },
    { label: 'Média mensal', value: formatCurrency(avg), sub: 'Últimos 3 meses', icon: TrendingUp, iconColor: '#C9A86A', highlight: true },
    { label: 'Maior receita', value: formatCurrency(max?.amount ?? 0), sub: max?.name ?? '—', icon: Star, iconColor: '#6B6B80', highlight: false },
    { label: 'Entradas', value: String(count), sub: 'Este mês', icon: ArrowUpDown, iconColor: '#5B8DEF', highlight: false },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: '#16161E', border: card.highlight ? '1px solid rgba(201,168,106,0.3)' : '1px solid #2A2A38' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: card.highlight ? '#C9A86A' : '#9090A0' }}>{card.label}</span>
              <Icon size={14} style={{ color: card.iconColor }} />
            </div>
            <p className="text-xl font-bold tabular-nums" style={{ color: card.highlight ? '#C9A86A' : '#F0F0F5' }}>
              {card.value}
            </p>
            <p className="text-[11px] mt-1 truncate" style={{ color: '#6B6B80' }}>{card.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `src/components/receitas/ReceitasCategoryChart.tsx`**

```typescript
'use client'

import { PieChart, Pie, Cell, Label } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { Receita } from '@/lib/supabase/queries'

const COLORS = ['#C9A86A', '#7A5C2E', '#D9BE87', '#3A3A45']

type Props = { receitas: Receita[] }

export default function ReceitasCategoryChart({ receitas }: Props) {
  const categoryMap: Record<string, number> = {}
  receitas.forEach(r => { categoryMap[r.category] = (categoryMap[r.category] ?? 0) + r.amount })
  const total = Object.values(categoryMap).reduce((s, v) => s + v, 0)
  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      name, value,
      color: COLORS[i % COLORS.length],
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0',
    }))

  function CenterLabel() {
    return (
      <g>
        <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 16, fontWeight: 700, fill: '#F0F0F5' }}>
          {formatCurrency(total)}
        </text>
        <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 10, fill: '#6B6B80' }}>
          Total
        </text>
      </g>
    )
  }

  return (
    <div className="rounded-xl p-5 flex flex-col" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      <p className="text-sm font-semibold mb-4" style={{ color: '#F0F0F5' }}>Receitas por categoria</p>
      {categories.length === 0 ? (
        <p className="text-xs text-center py-8" style={{ color: '#6B6B80' }}>Sem dados ainda</p>
      ) : (
        <div className="flex items-center gap-5">
          <PieChart width={160} height={160}>
            <Pie data={categories} dataKey="value" cx="50%" cy="50%"
              innerRadius={50} outerRadius={72} startAngle={90} endAngle={-270} strokeWidth={0}>
              {categories.map(cat => <Cell key={cat.name} fill={cat.color} />)}
              <Label content={<CenterLabel />} position="center" />
            </Pie>
          </PieChart>
          <div className="flex flex-col gap-2 flex-1">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs flex-1" style={{ color: '#9090A0' }}>{cat.name}</span>
                <span className="text-xs font-medium tabular-nums" style={{ color: '#D0D0D8' }}>{formatCurrency(cat.value)}</span>
                <span className="text-[11px] w-10 text-right" style={{ color: '#6B6B80' }}>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `src/components/receitas/ReceitasLineChart.tsx`**

```typescript
'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ChevronDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { MonthlyData } from '@/lib/mock-data'

type Props = { monthlyData: MonthlyData[] }

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}>
      {formatCurrency(payload[0].value)}
    </div>
  )
}

export default function ReceitasLineChart({ monthlyData }: Props) {
  return (
    <div className="rounded-xl p-5 flex flex-col flex-1" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>Evolução das receitas</p>
        <button
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg"
          style={{ backgroundColor: '#1E1E28', border: '1px solid #2A2A38', color: '#9090A0' }}
        >
          Últimos 6 meses <ChevronDown size={11} />
        </button>
      </div>
      <div className="flex-1" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A86A" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#C9A86A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#1E1E28" />
            <XAxis dataKey="month" tick={{ fill: '#6B6B80', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `R$ ${v}`} tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C9A86A', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="value" stroke="#C9A86A" strokeWidth={2} fill="url(#incomeGrad)"
              dot={{ fill: '#C9A86A', r: 3, strokeWidth: 0 }} activeDot={{ fill: '#C9A86A', r: 5, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #1E1E28' }}>
        <div className="w-5 h-0.5 rounded" style={{ backgroundColor: '#C9A86A' }} />
        <span className="text-[11px]" style={{ color: '#6B6B80' }}>Receitas (R$)</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `src/components/receitas/ReceitasTable.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { Search, ChevronDown, Download, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { incomeCategoryColors } from '@/lib/mock-data'
import { METHOD_LABEL } from '@/lib/categories'
import type { Receita } from '@/lib/supabase/queries'

type Props = {
  receitas: Receita[]
  onDelete: (id: string) => void
}

export default function ReceitasTable({ receitas, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas categorias')

  const categories = ['Todas categorias', ...Array.from(new Set(receitas.map(r => r.category)))]

  const filtered = receitas.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todas categorias' || r.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="rounded-xl flex flex-col" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2A2A38' }}>
        <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>Todas as receitas</p>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1E1E28', border: '1px solid #2A2A38', color: '#9090A0' }}>
          <Download size={12} /> Exportar
        </button>
      </div>

      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #2A2A38' }}>
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg" style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38' }}>
          <Search size={13} style={{ color: '#6B6B80' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar receita..."
            className="bg-transparent text-xs outline-none flex-1" style={{ color: '#D0D0D8' }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg outline-none appearance-none cursor-pointer"
          style={{ backgroundColor: '#0F0F15', border: '1px solid #2A2A38', color: '#D0D0D8' }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid text-[11px] px-5 py-2" style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr', color: '#6B6B80', borderBottom: '1px solid #2A2A38' }}>
        <span>Descrição</span><span>Categoria</span><span>Data</span><span>Valor</span><span>Método</span><span>Ações</span>
      </div>

      <div className="flex flex-col">
        {filtered.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: '#6B6B80' }}>
            {receitas.length === 0 ? 'Nenhuma receita ainda. Adicione a primeira!' : 'Nenhum resultado.'}
          </p>
        ) : filtered.map((r, i) => {
          const colors = incomeCategoryColors[r.category] ?? { text: '#9090A0', bg: 'rgba(144,144,160,0.12)' }
          return (
            <div key={r.id} className="grid items-center px-5 py-3 text-xs"
              style={{ gridTemplateColumns: '2fr 1.2fr 0.9fr 0.9fr 0.9fr 0.5fr', borderTop: i > 0 ? '1px solid #1E1E28' : undefined }}>
              <div className="flex items-center gap-2">
                <span className="text-base">{r.icon}</span>
                <span style={{ color: '#D0D0D8' }}>{r.name}</span>
              </div>
              <span><span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ color: colors.text, backgroundColor: colors.bg }}>{r.category}</span></span>
              <span style={{ color: '#9090A0' }}>{new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
              <span className="font-semibold tabular-nums" style={{ color: '#C9A86A' }}>{formatCurrency(r.amount)}</span>
              <span style={{ color: '#9090A0' }}>{METHOD_LABEL[r.method] ?? r.method}</span>
              <button onClick={() => onDelete(r.id)} className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
                <Trash2 size={13} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Rewrite `src/components/receitas/ReceitasSummary.tsx`**

```typescript
import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Receita } from '@/lib/supabase/queries'

type Props = { receitas: Receita[]; totalGastos: number }

export default function ReceitasSummary({ receitas, totalGastos }: Props) {
  const totalReceitas = receitas.reduce((sum, r) => sum + r.amount, 0)
  const saldo = totalReceitas - totalGastos

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-5" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#F0F0F5' }}>Resumo do mês</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#9090A0' }}>Total de receitas</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: '#F0F0F5' }}>{formatCurrency(totalReceitas)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#9090A0' }}>Total de gastos</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: '#E05C5C' }}>{formatCurrency(totalGastos)}</span>
          </div>
          <div className="h-px w-full" style={{ backgroundColor: '#2A2A38' }} />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: '#D0D0D8' }}>Saldo do mês</span>
            <span className="text-sm font-bold tabular-nums" style={{ color: saldo >= 0 ? '#4B9B7A' : '#E05C5C' }}>{formatCurrency(saldo)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">✨</span>
          <p className="text-xs font-semibold" style={{ color: '#C9A86A' }}>Insight do Drakma</p>
        </div>
        <div className="flex items-start gap-3">
          <p className="text-xs leading-relaxed flex-1" style={{ color: '#9090A0' }}>
            {saldo >= 0
              ? <>Você está no <span className="font-semibold" style={{ color: '#4B9B7A' }}>positivo</span> esse mês. Continue assim!</>
              : <>Seus gastos superaram as receitas em <span className="font-semibold" style={{ color: '#E05C5C' }}>{formatCurrency(Math.abs(saldo))}</span>.</>
            }
          </p>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1E2A22' }}>
            <TrendingUp size={16} style={{ color: '#4B9B7A' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Rewrite `src/app/receitas/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { CalendarDays, ChevronDown, Plus } from 'lucide-react'
import { useReceitas } from '@/hooks/useReceitas'
import { useGastos } from '@/hooks/useGastos'
import ReceitasStatCards from '@/components/receitas/ReceitasStatCards'
import ReceitasLineChart from '@/components/receitas/ReceitasLineChart'
import ReceitasCategoryChart from '@/components/receitas/ReceitasCategoryChart'
import ReceitasTable from '@/components/receitas/ReceitasTable'
import ReceitasSummary from '@/components/receitas/ReceitasSummary'
import AdicionarReceitaModal from '@/components/receitas/AdicionarReceitaModal'

export default function ReceitasPage() {
  const { receitas, loading, add, remove } = useReceitas()
  const { gastos } = useGastos()
  const [showModal, setShowModal] = useState(false)

  // Build monthly data from receitas
  const monthMap: Record<string, number> = {}
  receitas.forEach(r => {
    const d = new Date(r.date + 'T12:00:00')
    const key = d.toLocaleDateString('pt-BR', { month: 'short' })
    monthMap[key] = (monthMap[key] ?? 0) + r.amount
  })
  const monthlyData = Object.entries(monthMap).map(([month, value]) => ({ month, value }))
  const totalGastos = gastos.reduce((sum, g) => sum + g.amount, 0)

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <header className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#1E1E28' }}>
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#F0F0F5' }}>Receitas</h1>
          <p className="text-xs" style={{ color: '#6B6B80' }}>Acompanhe todas as suas entradas de dinheiro.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', color: '#D0D0D8' }}>
            <CalendarDays size={13} style={{ color: '#9090A0' }} />
            {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            <ChevronDown size={12} style={{ color: '#6B6B80' }} />
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#C9A86A', color: '#1B1B1F' }}>
            <Plus size={13} /> Adicionar receita
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 flex flex-col gap-5">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#6B6B80' }}>Carregando...</p>
          </div>
        ) : (
          <>
            <ReceitasStatCards receitas={receitas} />
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
              <ReceitasLineChart monthlyData={monthlyData} />
              <ReceitasCategoryChart receitas={receitas} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 min-w-0"><ReceitasTable receitas={receitas} onDelete={remove} /></div>
              <div className="flex-shrink-0" style={{ width: 280 }}><ReceitasSummary receitas={receitas} totalGastos={totalGastos} /></div>
            </div>
          </>
        )}
      </main>

      {showModal && <AdicionarReceitaModal onClose={() => setShowModal(false)} onAdd={add} />}
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/receitas/ src/app/receitas/page.tsx
git commit -m "feat: receitas page with real Supabase data and modal"
```

---

## Task 9: Dashboard with real data

**Files:**
- Modify: `src/components/dashboard/SummaryCards.tsx`
- Modify: `src/components/dashboard/CategoryChart.tsx`
- Modify: `src/components/dashboard/RecentExpenses.tsx`
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Rewrite `src/components/dashboard/SummaryCards.tsx`**

```typescript
'use client'

import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

type Props = {
  receitas: number
  gastos: number
  saldo: number
  previsao: number
}

export default function SummaryCards({ receitas, gastos, saldo, previsao }: Props) {
  const cards = [
    { label: 'Receitas', value: formatCurrency(receitas), icon: TrendingUp, color: '#C9A86A', iconBg: '#2A2212' },
    { label: 'Gastos', value: formatCurrency(gastos), icon: TrendingDown, color: '#E05C5C', iconBg: '#2A1212' },
    { label: 'Saldo disponível', value: formatCurrency(saldo), icon: Wallet, color: saldo >= 0 ? '#F0F0F5' : '#E05C5C', iconBg: '#1A1E2A' },
    { label: 'Previsão para o mês', value: formatCurrency(previsao), icon: Calendar, color: '#5B8DEF', iconBg: '#1A1E2A' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="rounded-xl p-4" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: card.iconBg }}>
              <Icon size={16} style={{ color: card.color }} />
            </div>
            <p className="text-xl font-bold tabular-nums" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs mt-1" style={{ color: '#9090A0' }}>{card.label}</p>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `src/components/dashboard/CategoryChart.tsx`**

```typescript
'use client'

import { PieChart, Pie, Cell, Label } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import type { Gasto } from '@/lib/supabase/queries'

const COLORS = ['#C9A86A', '#E05C5C', '#4B9B7A', '#8B7EC8', '#5B8DEF', '#D0D0D8']

type Props = { gastos: Gasto[] }

export default function CategoryChart({ gastos }: Props) {
  const categoryMap: Record<string, number> = {}
  gastos.forEach(g => { categoryMap[g.category] = (categoryMap[g.category] ?? 0) + g.amount })
  const total = Object.values(categoryMap).reduce((s, v) => s + v, 0)
  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length], percentage: total > 0 ? Math.round((value / total) * 100) : 0 }))

  function CenterLabel() {
    return (
      <g>
        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 20, fontWeight: 700, fill: '#F0F0F5', letterSpacing: '-0.5px' }}>
          {formatCurrency(total)}
        </text>
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 11, fontWeight: 500, fill: '#6B6B80' }}>
          Total gasto
        </text>
      </g>
    )
  }

  return (
    <div className="rounded-xl flex flex-col" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', padding: '20px' }}>
      <p className="text-[13px] font-semibold mb-4" style={{ color: '#F0F0F5' }}>Gastos por categoria</p>
      {categories.length === 0 ? (
        <p className="text-xs text-center py-8" style={{ color: '#6B6B80' }}>Sem gastos ainda</p>
      ) : (
        <>
          <div className="flex justify-center">
            <PieChart width={200} height={200}>
              <Pie data={categories} dataKey="value" cx="50%" cy="50%"
                innerRadius={62} outerRadius={90} startAngle={90} endAngle={-270} strokeWidth={0}>
                {categories.map(cat => <Cell key={cat.name} fill={cat.color} />)}
                <Label content={<CenterLabel />} position="center" />
              </Pie>
            </PieChart>
          </div>
          <div className="flex flex-col gap-2 mt-4 flex-1">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs flex-1" style={{ color: '#9090A0' }}>{cat.name}</span>
                <span className="text-xs font-medium tabular-nums" style={{ color: '#D0D0D8' }}>{formatCurrency(cat.value)}</span>
                <span className="text-[11px] w-8 text-right" style={{ color: '#6B6B80' }}>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="mt-4 pt-3 border-t" style={{ borderColor: '#2A2A38' }}>
        <Link href="/gastos" className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: '#C9A86A' }}>
          Ver relatório completo →
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `src/components/dashboard/RecentExpenses.tsx`**

```typescript
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function RecentExpenses({ gastos }: Props) {
  const recent = gastos.slice(0, 5)

  return (
    <div className="rounded-xl flex flex-col h-full" style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', padding: '16px' }}>
      <p className="text-[13px] font-semibold mb-3" style={{ color: '#F0F0F5' }}>Gastos recentes</p>
      {recent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs" style={{ color: '#6B6B80' }}>Nenhum gasto ainda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          {recent.map(g => (
            <div key={g.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                style={{ backgroundColor: '#1E1E28' }}>
                {g.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: '#D0D0D8' }}>{g.name}</p>
                <p className="text-[10px]" style={{ color: '#6B6B80' }}>
                  {new Date(g.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </p>
              </div>
              <span className="text-xs font-semibold tabular-nums" style={{ color: '#E05C5C' }}>
                -{formatCurrency(g.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 pt-3 border-t" style={{ borderColor: '#2A2A38' }}>
        <Link href="/gastos" className="text-xs font-medium hover:opacity-70" style={{ color: '#C9A86A' }}>
          Ver todos →
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `src/app/dashboard/page.tsx`**

```typescript
'use client'

import TopHeader from '@/components/layout/TopHeader'
import SummaryCards from '@/components/dashboard/SummaryCards'
import BentoGrid from '@/components/dashboard/BentoGrid'
import { useGastos } from '@/hooks/useGastos'
import { useReceitas } from '@/hooks/useReceitas'

export default function DashboardPage() {
  const { gastos, loading: loadingGastos } = useGastos()
  const { receitas, loading: loadingReceitas } = useReceitas()

  const totalGastos = gastos.reduce((sum, g) => sum + g.amount, 0)
  const totalReceitas = receitas.reduce((sum, r) => sum + r.amount, 0)
  const saldo = totalReceitas - totalGastos
  const previsao = saldo > 0 ? saldo * 0.15 : 0

  const loading = loadingGastos || loadingReceitas

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <TopHeader />
      <main className="flex-1 overflow-auto flex flex-col gap-4" style={{ padding: '20px 24px' }}>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#6B6B80' }}>Carregando...</p>
          </div>
        ) : (
          <>
            <SummaryCards
              receitas={totalReceitas}
              gastos={totalGastos}
              saldo={saldo}
              previsao={previsao}
            />
            <BentoGrid gastos={gastos} />
          </>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Update `src/components/dashboard/BentoGrid.tsx` to accept gastos prop**

```typescript
import CategoryChart from './CategoryChart'
import InsightBanner from './InsightBanner'
import RecentExpenses from './RecentExpenses'
import AIAssistant from '@/components/ai/AIAssistant'
import type { Gasto } from '@/lib/supabase/queries'

type Props = { gastos: Gasto[] }

export default function BentoGrid({ gastos }: Props) {
  return (
    <div
      className="flex-1"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr 1fr',
        gridTemplateRows: 'auto 1fr',
        gap: 12,
        minHeight: 0,
      }}
    >
      <div style={{ gridRow: 'span 2', minHeight: 0 }}>
        <CategoryChart gastos={gastos} />
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <InsightBanner />
      </div>
      <div style={{ minHeight: 0 }}>
        <RecentExpenses gastos={gastos} />
      </div>
      <div style={{ minHeight: 0 }}>
        <AIAssistant />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/ src/app/dashboard/page.tsx
git commit -m "feat: dashboard with real aggregated data"
```

---

## Task 10: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git push origin master
```

- [ ] **Step 2: Verify Vercel auto-deploys**

Vercel detects the push and deploys automatically. Monitor at vercel.com/dashboard.

- [ ] **Step 3: Test in production**

1. Open https://drakma.vercel.app
2. Login with Google
3. Add a gasto → confirm it appears in the table
4. Add a receita → confirm it appears in the table
5. Check dashboard shows real totals
6. Delete an entry → confirm it disappears

---

## Verification

After all tasks complete:

```bash
npx tsc --noEmit   # zero TypeScript errors
```

Then in the browser:
- [ ] Dashboard shows R$ 0,00 for a new user (no mock data)
- [ ] "Adicionar gasto" modal opens, saves, and table updates immediately
- [ ] "Adicionar receita" modal opens, saves, and table updates immediately
- [ ] Deleting entries works
- [ ] Charts update based on real data
- [ ] Logging out and back in preserves data
