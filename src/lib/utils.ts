import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const formatted = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
  return formatted.replace(/de (\w)/, (_, c) => `de ${c.toUpperCase()}`)
}
