import { createClient } from './client'

export type Meta = {
  id: string
  user_id: string
  name: string
  icon: string
  target_amount: number
  current_amount: number
  deadline: string | null
  created_at: string
}

export type MetaInput = {
  user_id: string
  name: string
  icon: string
  target_amount: number
  current_amount: number
  deadline: string | null
}

const supabase = createClient()

export async function fetchMetas(): Promise<Meta[]> {
  const { data, error } = await supabase
    .from('metas')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function insertMeta(input: MetaInput): Promise<Meta> {
  const { data, error } = await supabase
    .from('metas')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function patchMeta(id: string, updates: Partial<MetaInput>): Promise<Meta> {
  const { data, error } = await supabase
    .from('metas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeMeta(id: string): Promise<void> {
  const { error } = await supabase.from('metas').delete().eq('id', id)
  if (error) throw error
}
