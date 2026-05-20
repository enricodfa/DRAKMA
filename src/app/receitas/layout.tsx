import AppShell from '@/components/layout/AppShell'

export default function ReceitasLayout({ children }: { children: React.ReactNode }) {
  return <AppShell colorScheme="dark">{children}</AppShell>
}
