export const GASTOS_CATEGORIES = [
  'Alimentação', 'Transporte', 'Delivery', 'Lazer',
  'Estudos', 'Saúde', 'Outros',
] as const

export const GASTOS_METHODS = ['pix', 'visa', 'mastercard'] as const

export const RECEITAS_CATEGORIES = [
  'Bolsa de Estudos', 'Trabalho', 'Ajuda dos pais', 'Outros',
] as const

export const RECEITAS_METHODS = ['pix', 'transferencia', 'ted', 'deposito'] as const

export const CATEGORY_ICON: Record<string, string> = {
  'Alimentação': '🍽️',
  'Transporte': '🚗',
  'Delivery': '🛵',
  'Lazer': '🎮',
  'Estudos': '📚',
  'Saúde': '💊',
  'Bolsa de Estudos': '🎓',
  'Trabalho': '💼',
  'Ajuda dos pais': '👨‍👩‍👧',
  'Outros': '•••',
}

export const METHOD_LABEL: Record<string, string> = {
  pix: 'PIX',
  visa: 'Visa',
  mastercard: 'Mastercard',
  transferencia: 'Transferência',
  ted: 'TED',
  deposito: 'Depósito',
}
