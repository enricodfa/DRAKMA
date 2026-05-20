# Drakma — Dashboard MVP Design Spec

**Data:** 2026-05-19  
**Produto:** Drakma — plataforma financeira com IA para universitários  
**Objetivo:** Interface desktop-first completa do MVP, pronta para apresentação a investidores e defesa acadêmica

---

## 1. Contexto e Objetivo

Drakma é uma plataforma financeira com IA voltada para universitários que automatiza a organização financeira e transforma dados complexos em insights simples. O MVP foca em apresentar uma interface de alta qualidade visual que comunique profissionalismo e clareza financeira.

**Público-alvo:** Universitários brasileiros, 18–26 anos  
**Ambiente:** Desktop-first (1920px), com suporte a tablet  
**Modo:** MVP estático — dados mockados, sem backend real

---

## 2. Decisões de Design

| Decisão | Escolha | Motivo |
|---|---|---|
| Tema | Light com Sidebar Dark | Mais próximo da referência, clean e acessível |
| Sidebar | Expansível com toggle | Orientação inicial + espaço quando colapsada |
| Layout dashboard | Bento Grid Assimétrico | Visual moderno, estilo Linear/Notion |
| Assistente IA | Mock simulado com typing animation | Sem custo de API, perfeito para apresentação |

---

## 3. Identidade Visual

### Paleta de Cores
```
Fundo principal:     #F4F4F2  (cinza muito suave)
Cards / superfícies: #FFFFFF
Sidebar background:  #1B1B1F  (grafite escuro)
Sidebar secundária:  #2A2A31
Dourado principal:   #C9A86A  (destaques, ativo, CTA)
Dourado claro:       #D9BE87
Branco suave:        #F7F7F5
Cinza texto:         #9090A0
Vermelho gastos:     #E05C5C
Verde positivo:      #4B9B7A
Azul previsão:       #5B8DEF
```

### Tipografia
- Fonte: Inter (system-ui fallback)
- Títulos de card: 13px, weight 600, #1B1B1F
- Valores financeiros: 22px, weight 700, letter-spacing -0.5px
- Labels: 11px, weight 500, #9090A0
- Body/listas: 12px, weight 400–500

### Regras de Uso do Dourado
- Apenas em: item ativo na nav, CTAs primários, valores de receita/previsão, headers de seções IA, insights em destaque
- Nunca em: textos corridos, bordas decorativas, backgrounds de card

---

## 4. Estrutura de Arquivos

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (sidebar + fundo global)
│   ├── page.tsx                    # Redirect → /dashboard
│   ├── dashboard/
│   │   └── page.tsx
│   ├── gastos/
│   │   └── page.tsx
│   ├── receitas/
│   │   └── page.tsx
│   ├── insights/
│   │   └── page.tsx
│   └── configuracoes/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Sidebar expansível com toggle (220px ↔ 56px)
│   │   ├── SidebarNav.tsx          # Itens de nav com active state
│   │   └── TopHeader.tsx           # Saudação, seletor de mês, botão adicionar
│   │
│   ├── dashboard/
│   │   ├── SummaryCards.tsx        # 4 cards: receitas/gastos/saldo/previsão
│   │   ├── BentoGrid.tsx           # Grid assimétrico 3 colunas
│   │   ├── CategoryChart.tsx       # Donut chart (Recharts) + legenda
│   │   ├── RecentExpenses.tsx      # Lista de últimos gastos com ícone/data/valor
│   │   └── InsightBanner.tsx       # Banner dark com 3 insight cards
│   │
│   ├── insights/
│   │   └── InsightCard.tsx         # Card individual de insight reutilizável
│   │
│   └── ai/
│       ├── AIAssistant.tsx         # Painel de chat do assistente
│       └── useTypingEffect.ts      # Hook: typing animation com delay artificial
│
├── lib/
│   ├── mock-data.ts                # Dados financeiros estáticos tipados
│   └── utils.ts                   # cn(), formatCurrency(BRL), formatDate()
│
└── store/
    └── ai-chat.ts                  # Zustand: histórico de mensagens + isTyping state
```

---

## 5. Componentes — Especificação

### 5.1 Sidebar
- **Estado expandido:** 220px, logo + nome + nav com ícone e label + card Premium + perfil
- **Estado colapsado:** 56px, apenas ícones + tooltip no hover
- **Toggle:** botão chevron no topo direito da sidebar, transição CSS `width` 250ms ease
- **Nav items:** Dashboard, Gastos, Receitas, Categorias, Insights IA, Metas (badge "breve"), Configurações
- **Active state:** background `rgba(201,168,106,0.12)`, texto e ícone em `#C9A86A`
- **Card Premium:** background `#2A2A31`, borda `#C9A86A30`, CTA em dourado sólido
- **Perfil:** avatar circular (inicial do nome), nome + plano, chevron

### 5.2 TopHeader
- Saudação dinâmica: "Olá, [nome] 👋" + subtítulo
- Seletor de mês: dropdown aparente (mock, não funcional no MVP)
- Botão notificações: ícone de sino
- Botão "+ Adicionar gasto": dark (#1B1B1F), texto claro, dropdown aparente

### 5.3 SummaryCards (4 cards)
| Card | Valor | Cor | Ícone bg |
|---|---|---|---|
| Receitas | R$ 1.200,00 | #C9A86A | #FFF8EE |
| Gastos | R$ 320,00 | #E05C5C | #FFF0F0 |
| Saldo disponível | R$ 880,00 | #1B1B1F | #F0F4FF |
| Previsão para o mês | R$ 120,00 | #5B8DEF | #F0FFF8 |

### 5.4 BentoGrid — Layout Assimétrico
```
[ CategoryChart  ] [ InsightBanner (span 2 cols)          ]
[ (span 2 rows)  ] [ RecentExpenses    ] [ AIAssistant    ]
```
- Grid: `grid-template-columns: 1fr 1.4fr 1fr`
- Gap: 12px
- CategoryChart: `grid-row: span 2`
- InsightBanner: `grid-column: span 2`

### 5.5 CategoryChart
- Biblioteca: Recharts `<PieChart>` com `innerRadius` (donut)
- Centro do donut: valor total + label "Total gasto"
- Legenda abaixo: nome da categoria, valor em R$, percentual
- Categorias: Delivery 43%, Transporte 19%, Alimentação 16%, Lazer 12%, Outros 10%
- Cores: #C9A86A, #E05C5C, #4B9B7A, #8B7EC8, #D0D0D8
- Link "Ver relatório completo →" no rodapé do card

### 5.6 InsightBanner
- Background: `#1B1B1F`
- Header: "✦ Insights do Drakma" em `#C9A86A`
- 3 insight cards em grid `1fr 1fr 1fr` com background `#242428`
- Conteúdo dos cards: emoji ícone + texto com valores destacados em dourado/verde/vermelho
- Insights mockados:
  1. "Você gastou **R$140** com delivery — 43% dos seus gastos"
  2. "Transporte aumentou **35%** em relação ao mês passado"
  3. "Se continuar assim, sobrará **R$120** a mais do que planejou"

### 5.7 RecentExpenses
- Lista de até 5 itens: ícone emoji, nome, data, valor em vermelho
- Divisórias sutis entre itens (1px, #F5F5F3)
- Link "Ver todos os gastos →" no rodapé
- Gastos mock: iFood R$35, Uber R$18,50, Café R$9,90, Mercado R$87,30, Lanche R$14

### 5.8 AIAssistant
- Background: `#2A2A31`
- Header: "✦ Assistente IA" + badge "BETA"
- Mensagem do usuário: balão dourado sólido, alinhado à direita
- Resposta da IA: avatar robô + balão `#363640`, texto em `#D0D0D8`
- Input: background `#363640`, placeholder "Pergunte algo...", botão enviar dourado
- Typing animation: `useTypingEffect` hook — exibe caracteres progressivamente com delay de 30ms/char após 800ms de "pensamento"
- Respostas mockadas: array de QA pré-definidas em `mock-data.ts`, match por palavras-chave

---

## 6. Fluxo de Dados

```
mock-data.ts
  └── financialData (receitas, gastos, categorias, recentes)
  └── insightsData (array de insights)
  └── aiResponses (array de {keywords[], response})

store/ai-chat.ts (Zustand)
  └── messages: Message[]
  └── isTyping: boolean
  └── sendMessage(text): void  → match keywords → delay 800ms → typing animation
```

Nenhum fetch real. Todos os dados importados diretamente nos componentes ou via store.

---

## 7. Comportamentos Interativos

| Elemento | Comportamento |
|---|---|
| Sidebar toggle | Anima largura 220px ↔ 56px, labels somem/aparecem com fade |
| Nav items | Hover: background sutil. Active: dourado |
| Summary cards | Hover: box-shadow aumenta ligeiramente |
| Botão "+ Adicionar gasto" | Hover: background muda para #2A2A31 |
| AI input | Enter ou clique no botão: dispara `sendMessage`, mostra typing indicator |
| Typing indicator | 3 pontos animados enquanto `isTyping === true` |
| "Ver todos" links | Navegam para a rota correspondente (gastos/, receitas/) |

---

## 8. Stack Técnica

```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "components": "shadcn/ui",
  "charts": "Recharts",
  "state": "Zustand",
  "icons": "Lucide React"
}
```

---

## 9. Páginas do MVP (stub)

Além do Dashboard completo, as demais páginas terão layout com sidebar + header funcionais e conteúdo em construção (`Em breve`):

- `/gastos` — tabela de gastos (stub)
- `/receitas` — listagem de receitas (stub)
- `/insights` — cards de insights expandidos (stub)
- `/configuracoes` — formulário de perfil (stub)

---

## 10. Fora do Escopo (MVP)

- Autenticação / login
- Backend / banco de dados real
- API de IA real
- Modo mobile (responsividade básica de tablet é desejável, mas não obrigatória)
- Gráfico de previsão temporal (linha do tempo)
- Funcionalidade do seletor de mês
- Modal de adicionar gasto funcional
