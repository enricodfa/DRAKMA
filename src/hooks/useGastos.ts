'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePeriod } from '@/store/period'
import {
  fetchGastos, insertGasto, patchGasto, removeGasto,
  type Gasto, type GastoInput,
} from '@/lib/supabase/queries'

export function useGastos() {
  const { month, year } = usePeriod()
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
      const data = await fetchGastos(year, month)
      setGastos(data)
    } finally {
      setLoading(false)
    }
  }, [userId, month, year])

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
