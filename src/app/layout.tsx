import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drakma — Finanças Inteligentes',
  description: 'Plataforma financeira com IA para universitários',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
