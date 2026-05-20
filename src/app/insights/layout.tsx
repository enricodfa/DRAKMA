import AppShell from '@/components/layout/AppShell'

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell colorScheme="dark">{children}</AppShell>
}
