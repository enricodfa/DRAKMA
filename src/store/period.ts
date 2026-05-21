'use client'

import { create } from 'zustand'
import type { Gasto, Receita } from '@/lib/supabase/queries'

function getBrasiliaDate() {
  return new Date(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()))
}

const now = getBrasiliaDate()

type PeriodState = {
  month: number
  year: number
  setPeriod: (month: number, year: number) => void

  // cached user
  userId: string | null
  setUserId: (id: string | null) => void

  // cached data (keyed by "YYYY-MM")
  gastos: Gasto[]
  receitas: Receita[]
  gastosLoading: boolean
  receitasLoading: boolean
  loadedKey: string | null  // "YYYY-MM" of last successful load

  setGastos: (data: Gasto[], key: string) => void
  setReceitas: (data: Receita[], key: string) => void

  setGastosLoading: (v: boolean) => void
  setReceitasLoading: (v: boolean) => void
  addGasto: (g: Gasto) => void
  removeGasto: (id: string) => void
  addReceita: (r: Receita) => void
  removeReceita: (id: string) => void
}

export const usePeriod = create<PeriodState>((set, get) => ({
  month: now.getMonth(),
  year: now.getFullYear(),
  setPeriod: (month, year) => set({ month, year, loadedKey: null }),

  userId: null,
  setUserId: (userId) => set({ userId }),

  gastos: [],
  receitas: [],
  gastosLoading: false,
  receitasLoading: false,
  loadedKey: null,

  setGastos: (gastos, key) => set({ gastos, loadedKey: key, gastosLoading: false }),
  setReceitas: (receitas, key) => set({ receitas, loadedKey: key, receitasLoading: false }),
  setGastosLoading: (v) => set({ gastosLoading: v }),
  setReceitasLoading: (v) => set({ receitasLoading: v }),

  addGasto: (g) => set({ gastos: [g, ...get().gastos] }),
  removeGasto: (id) => set({ gastos: get().gastos.filter(g => g.id !== id) }),
  addReceita: (r) => set({ receitas: [r, ...get().receitas] }),
  removeReceita: (id) => set({ receitas: get().receitas.filter(r => r.id !== id) }),
}))

export function periodKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}
