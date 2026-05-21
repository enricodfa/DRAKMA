'use client'

import { create } from 'zustand'

function getBrasiliaDate() {
  return new Date(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()))
}

type PeriodState = {
  month: number
  year: number
  setPeriod: (month: number, year: number) => void
}

const now = getBrasiliaDate()

export const usePeriod = create<PeriodState>((set) => ({
  month: now.getMonth(),
  year: now.getFullYear(),
  setPeriod: (month, year) => set({ month, year }),
}))
