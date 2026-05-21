'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePeriod, periodKey } from '@/store/period'
import { fetchGastos, insertGasto, patchGasto, removeGasto, type GastoInput } from '@/lib/supabase/queries'

export function useGastos() {
  const {
    month, year, userId, setUserId,
    gastos, gastosLoading, loadedKey,
    setGastos, setGastosLoading, addGasto, removeGasto: storeRemove,
  } = usePeriod()

  const key = periodKey(year, month)

  // fetch userId once globally
  useEffect(() => {
    if (userId) return
    createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [userId, setUserId])

  // fetch data only when period changes or not yet loaded
  useEffect(() => {
    if (!userId || loadedKey === key || gastosLoading) return
    setGastosLoading(true)
    fetchGastos(year, month).then(data => setGastos(data, key)).catch(() => setGastosLoading(false))
  }, [userId, key, loadedKey, gastosLoading, year, month, setGastos, setGastosLoading])

  const add = useCallback(async (input: Omit<GastoInput, 'user_id'>) => {
    if (!userId) return
    const created = await insertGasto({ ...input, user_id: userId })
    addGasto(created)
    return created
  }, [userId, addGasto])

  const update = useCallback(async (id: string, updates: Partial<GastoInput>) => {
    const updated = await patchGasto(id, updates)
    usePeriod.setState(s => ({ gastos: s.gastos.map(g => g.id === id ? updated : g) }))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await removeGasto(id)
    storeRemove(id)
  }, [storeRemove])

  return { gastos, loading: gastosLoading, add, update, remove }
}
