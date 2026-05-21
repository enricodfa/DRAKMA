'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePeriod } from '@/store/period'
import {
  fetchReceitas, insertReceita, patchReceita, removeReceita,
  type Receita, type ReceitaInput,
} from '@/lib/supabase/queries'

export function useReceitas() {
  const { month, year } = usePeriod()
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
      const data = await fetchReceitas(year, month)
      setReceitas(data)
    } finally {
      setLoading(false)
    }
  }, [userId, month, year])

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
