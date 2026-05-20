import TopHeader from '@/components/layout/TopHeader'
import SummaryCards from '@/components/dashboard/SummaryCards'
import BentoGrid from '@/components/dashboard/BentoGrid'

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopHeader />
      <main
        className="flex-1 overflow-auto flex flex-col gap-4"
        style={{ padding: '20px 24px' }}
      >
        <SummaryCards />
        <BentoGrid />
      </main>
    </div>
  )
}
