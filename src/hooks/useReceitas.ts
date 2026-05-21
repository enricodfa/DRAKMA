'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePeriod, periodKey } from '@/store/period'
import { fetchReceitas, insertReceita, patchReceita, removeReceita, type ReceitaInput } from '@/lib/supabase/queries'

export function useReceitas() {
  const {
    month, year, userId, setUserId,
    receitas, receitasLoading, loadedKey,
    setReceitas, setReceitasLoading, addReceita, removeReceita: storeRemove,
  } = usePeriod()

  const key = periodKey(year, month)

  // fetch userId once globally (shared with useGastos)
  useEffect(() => {
    if (userId) return
    createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [userId, setUserId])

  // fetch data only when period changes or not yet loaded
  useEffect(() => {
    if (!userId || loadedKey === key || receitasLoading) return
    setReceitasLoading(true)
    fetchReceitas(year, month).then(data => setReceitas(data, key)).catch(() => setReceitasLoading(false))
  }, [userId, key, loadedKey, receitasLoading, year, month, setReceitas, setReceitasLoading])

  const add = useCallback(async (input: Omit<ReceitaInput, 'user_id'>) => {
    if (!userId) return
    const created = await insertReceita({ ...input, user_id: userId })
    addReceita(created)
    return created
  }, [userId, addReceita])

  const update = useCallback(async (id: string, updates: Partial<ReceitaInput>) => {
    const updated = await patchReceita(id, updates)
    usePeriod.setState(s => ({ receitas: s.receitas.map(r => r.id === id ? updated : r) }))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await removeReceita(id)
    storeRemove(id)
  }, [storeRemove])

  return { receitas, loading: receitasLoading, add, update, remove }
}
