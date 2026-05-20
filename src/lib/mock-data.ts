export type Category = {
  name: string
  value: number
  color: string
  percentage: number
}

export type Expense = {
  id: string
  name: string
  date: string
  amount: number
  icon: string
  category: string
}

export type FinancialSummary = {
  receitas: number
  gastos: number
  saldo: number
  previsao: number
}

export type Insight = {
  id: string
  icon: string
  text: string
  highlight: string
}

export type AIResponse = {
  keywords: string[]
  response: string
}

export const financialSummary: FinancialSummary = {
  receitas: 1200,
  gastos: 320,
  saldo: 880,
  previsao: 120,
}

export const categories: Category[] = [
  { name: 'Delivery', value: 140, color: '#C9A86A', percentage: 43 },
  { name: 'Transporte', value: 60, color: '#E05C5C', percentage: 19 },
  { name: 'Alimentação', value: 50, color: '#4B9B7A', percentage: 16 },
  { name: 'Lazer', value: 40, color: '#8B7EC8', percentage: 12 },
  { name: 'Outros', value: 30, color: '#D0D0D8', percentage: 10 },
]

export const recentExpenses: Expense[] = [
  { id: '1', name: 'iFood', date: '2024-05-23', amount: 35, icon: '🍔', category: 'Delivery' },
  { id: '2', name: 'Uber', date: '2024-05-23', amount: 18.5, icon: '🚗', category: 'Transporte' },
  { id: '3', name: 'Café da Manhã', date: '2024-05-23', amount: 9.9, icon: '☕', category: 'Alimentação' },
  { id: '4', name: 'Mercado Extra', date: '2024-05-22', amount: 87.3, icon: '🛒', category: 'Alimentação' },
  { id: '5', name: 'Lanche', date: '2024-05-22', amount: 14, icon: '🥪', category: 'Alimentação' },
]

export const insights: Insight[] = [
  {
    id: '1',
    icon: '🛵',
    text: 'Você gastou {highlight} com delivery este mês. Isso representa 43% dos seus gastos.',
    highlight: 'R$ 140,00',
  },
  {
    id: '2',
    icon: '🚗',
    text: 'Seus gastos com transporte aumentaram {highlight} em relação ao mês passado.',
    highlight: '35%',
  },
  {
    id: '3',
    icon: '✅',
    text: 'Se continuar assim, você pode terminar o mês com {highlight} a mais do que planejou.',
    highlight: 'R$ 120,00',
  },
]

const aiResponses: AIResponse[] = [
  {
    keywords: ['final de semana', 'sair', 'festa', 'passeio'],
    response:
      'Considerando seus gastos atuais, você tem **R$ 880,00** disponíveis. Se mantiver o ritmo, poderá gastar até **R$ 80,00** no fim de semana sem comprometer seu orçamento. Quer que eu simule para você?',
  },
  {
    keywords: ['delivery', 'ifood', 'rappi', 'uber eats'],
    response:
      'Você já gastou **R$ 140,00** com delivery este mês — 43% do total. Considere cozinhar em casa 2x por semana para economizar até **R$ 56,00** no mês.',
  },
  {
    keywords: ['transporte', 'uber', 'ônibus', 'gasolina'],
    response:
      'Seus gastos com transporte foram **R$ 60,00** este mês, um aumento de **35%** em relação ao mês passado. Você costuma usar bastante Uber — considere o transporte público em horários não-pico.',
  },
  {
    keywords: ['economizar', 'poupar', 'guardar', 'sobrar'],
    response:
      'Se mantiver o ritmo atual, você vai terminar o mês com **R$ 120,00** sobrando. Para aumentar isso, o principal corte seria em delivery, que representa 43% dos seus gastos.',
  },
  {
    keywords: ['saldo', 'quanto tenho', 'disponível'],
    response:
      'Seu saldo disponível hoje é de **R$ 880,00**. Desse valor, a projeção para o fim do mês é que sobrem **R$ 120,00** se você mantiver o ritmo atual.',
  },
]

export function findAIResponse(text: string): string {
  const lower = text.toLowerCase()
  const match = aiResponses.find((r) => r.keywords.some((k) => lower.includes(k)))
  return (
    match?.response ??
    'Analisando seus dados... Com base no seu padrão atual, você está dentro do planejamento. Posso te ajudar com algo mais específico?'
  )
}
