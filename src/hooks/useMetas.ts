'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { fetchMetas, insertMeta, patchMeta, removeMeta, type Meta, type MetaInput } from '@/lib/supabase/metas'

export function useMetas() {
  const [metas, setMetas] = useState<Meta[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  useEffect(() => {
    if (!userId) return
    fetchMetas().then(data => { setMetas(data); setLoading(false) }).catch(() => setLoading(false))
  }, [userId])

  const add = useCallback(async (input: Omit<MetaInput, 'user_id'>) => {
    if (!userId) return
    const created = await insertMeta({ ...input, user_id: userId })
    setMetas(prev => [created, ...prev])
    return created
  }, [userId])

  const update = useCallback(async (id: string, updates: Partial<MetaInput>) => {
    const updated = await patchMeta(id, updates)
    setMetas(prev => prev.map(m => m.id === id ? updated : m))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await removeMeta(id)
    setMetas(prev => prev.filter(m => m.id !== id))
  }, [])

  return { metas, loading, add, update, remove }
}
