import AppShell from '@/components/layout/AppShell'

export default function ConfiguracoesLayout({ children }: { children: React.ReactNode }) {
  return <AppShell colorScheme="dark">{children}</AppShell>
}
