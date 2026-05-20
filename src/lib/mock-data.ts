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
  method: 'pix' | 'visa' | 'mastercard'
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

export type MonthlyData = {
  month: string
  value: number
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

export const gastosCategories: Category[] = [
  { name: 'Alimentação', value: 146.3, color: '#4B9B7A', percentage: 45 },
  { name: 'Transporte', value: 74.3, color: '#5B8DEF', percentage: 23 },
  { name: 'Lazer', value: 43.9, color: '#8B7EC8', percentage: 14 },
  { name: 'Estudos', value: 45, color: '#C9A86A', percentage: 14 },
  { name: 'Saúde', value: 10.5, color: '#4B9B7A', percentage: 4 },
]

export const monthlyData: MonthlyData[] = [
  { month: 'Dez', value: 280 },
  { month: 'Jan', value: 310 },
  { month: 'Fev', value: 295 },
  { month: 'Mar', value: 340 },
  { month: 'Abr', value: 360 },
  { month: 'Mai', value: 320 },
]

export const recentExpenses: Expense[] = [
  { id: '1', name: 'iFood', date: '2024-05-23', amount: 35, icon: '🍔', category: 'Delivery', method: 'pix' },
  { id: '2', name: 'Uber', date: '2024-05-23', amount: 18.5, icon: '🚗', category: 'Transporte', method: 'mastercard' },
  { id: '3', name: 'Café da Manhã', date: '2024-05-23', amount: 9.9, icon: '☕', category: 'Alimentação', method: 'pix' },
  { id: '4', name: 'Mercado Extra', date: '2024-05-22', amount: 87.3, icon: '🛒', category: 'Alimentação', method: 'visa' },
  { id: '5', name: 'Lanche', date: '2024-05-22', amount: 14, icon: '🥪', category: 'Alimentação', method: 'pix' },
]

export const allExpenses: Expense[] = [
  { id: '1',  name: 'iFood - Almoço',     date: '2024-05-23', amount: 35,   icon: '🍔', category: 'Delivery',    method: 'pix' },
  { id: '2',  name: 'Uber - Faculdade',   date: '2024-05-23', amount: 18.5, icon: '🚗', category: 'Transporte',  method: 'mastercard' },
  { id: '3',  name: 'Café da Manhã',      date: '2024-05-23', amount: 9.9,  icon: '☕', category: 'Alimentação', method: 'pix' },
  { id: '4',  name: 'Mercado Extra',      date: '2024-05-22', amount: 87.3, icon: '🛒', category: 'Alimentação', method: 'visa' },
  { id: '5',  name: 'Lanche',             date: '2024-05-22', amount: 14,   icon: '🥪', category: 'Alimentação', method: 'pix' },
  { id: '6',  name: 'Netflix',            date: '2024-05-21', amount: 19.9, icon: '🎬', category: 'Lazer',       method: 'mastercard' },
  { id: '7',  name: 'Livraria Cultura',   date: '2024-05-20', amount: 45,   icon: '📚', category: 'Estudos',     method: 'visa' },
  { id: '8',  name: 'Farmácia São João',  date: '2024-05-20', amount: 32.4, icon: '💊', category: 'Saúde',       method: 'pix' },
  { id: '9',  name: 'Cinema',             date: '2024-05-19', amount: 24,   icon: '🎭', category: 'Lazer',       method: 'mastercard' },
  { id: '10', name: 'Uber - Casa',        date: '2024-05-18', amount: 16.8, icon: '🚗', category: 'Transporte',  method: 'visa' },
  { id: '11', name: 'Rappi - Jantar',     date: '2024-05-18', amount: 42,   icon: '🍕', category: 'Delivery',    method: 'pix' },
  { id: '12', name: 'Padaria',            date: '2024-05-17', amount: 12.5, icon: '🥐', category: 'Alimentação', method: 'pix' },
  { id: '13', name: 'Spotify',            date: '2024-05-16', amount: 10.9, icon: '🎵', category: 'Lazer',       method: 'mastercard' },
  { id: '14', name: '99 - Trabalho',      date: '2024-05-16', amount: 22.3, icon: '🚕', category: 'Transporte',  method: 'pix' },
  { id: '15', name: 'iFood - Lanche',     date: '2024-05-15', amount: 28,   icon: '🍔', category: 'Delivery',    method: 'pix' },
  { id: '16', name: 'Supermercado',       date: '2024-05-14', amount: 65.2, icon: '🛒', category: 'Alimentação', method: 'visa' },
  { id: '17', name: 'Dentista',           date: '2024-05-13', amount: 0,    icon: '🦷', category: 'Saúde',       method: 'pix' },
  { id: '18', name: 'Curso Udemy',        date: '2024-05-12', amount: 29.9, icon: '💻', category: 'Estudos',     method: 'visa' },
  { id: '19', name: 'Balada',             date: '2024-05-11', amount: 85,   icon: '🎉', category: 'Lazer',       method: 'mastercard' },
  { id: '20', name: 'Ônibus mensal',      date: '2024-05-10', amount: 120,  icon: '🚌', category: 'Transporte',  method: 'pix' },
  { id: '21', name: 'Hambúrguer',         date: '2024-05-09', amount: 32,   icon: '🍔', category: 'Delivery',    method: 'pix' },
  { id: '22', name: 'Farmácia',           date: '2024-05-08', amount: 18.6, icon: '💊', category: 'Saúde',       method: 'pix' },
  { id: '23', name: 'Restaurante',        date: '2024-05-07', amount: 54,   icon: '🍽️', category: 'Alimentação', method: 'mastercard' },
  { id: '24', name: 'iFood - Café',       date: '2024-05-06', amount: 15,   icon: '☕', category: 'Delivery',    method: 'pix' },
  { id: '25', name: 'App de estudos',     date: '2024-05-05', amount: 19.9, icon: '📱', category: 'Estudos',     method: 'visa' },
  { id: '26', name: 'Mercadinho',         date: '2024-05-04', amount: 38.7, icon: '🛒', category: 'Alimentação', method: 'pix' },
  { id: '27', name: 'Uber - Shopping',    date: '2024-05-03', amount: 14.5, icon: '🚗', category: 'Transporte',  method: 'mastercard' },
  { id: '28', name: 'Sorvete',            date: '2024-05-02', amount: 9,    icon: '🍦', category: 'Alimentação', method: 'pix' },
  { id: '29', name: 'Netflix + Max',      date: '2024-05-01', amount: 34.9, icon: '📺', category: 'Lazer',       method: 'mastercard' },
  { id: '30', name: 'Banca de revistas',  date: '2024-05-01', amount: 12,   icon: '📰', category: 'Estudos',     method: 'pix' },
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

export const categoryColors: Record<string, { text: string; bg: string }> = {
  Delivery:    { text: '#E05C5C', bg: 'rgba(224,92,92,0.12)' },
  Transporte:  { text: '#5B8DEF', bg: 'rgba(91,141,239,0.12)' },
  Alimentação: { text: '#4B9B7A', bg: 'rgba(75,155,122,0.12)' },
  Lazer:       { text: '#8B7EC8', bg: 'rgba(139,126,200,0.12)' },
  Estudos:     { text: '#C9A86A', bg: 'rgba(201,168,106,0.12)' },
  Saúde:       { text: '#4B9B7A', bg: 'rgba(75,155,122,0.12)' },
  Outros:      { text: '#9090A0', bg: 'rgba(144,144,160,0.12)' },
}
