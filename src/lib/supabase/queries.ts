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

function monthRange(year: number, month: number) {
  const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const end = new Date(year, month + 1, 0).toISOString().split('T')[0]
  return { start, end }
}

// ─── GASTOS ───────────────────────────────────────────────────
export async function fetchGastos(year: number, month: number): Promise<Gasto[]> {
  const supabase = createClient()
  const { start, end } = monthRange(year, month)
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .gte('date', start)
    .lte('date', end)
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
export async function fetchReceitas(year: number, month: number): Promise<Receita[]> {
  const supabase = createClient()
  const { start, end } = monthRange(year, month)
  const { data, error } = await supabase
    .from('receitas')
    .select('*')
    .gte('date', start)
    .lte('date', end)
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
