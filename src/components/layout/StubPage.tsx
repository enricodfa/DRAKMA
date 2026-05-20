import TopHeader from './TopHeader'

type StubPageProps = {
  title: string
}

export default function StubPage({ title }: StubPageProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopHeader />
      <main className="flex-1 flex flex-col items-center justify-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: '#F5F5F3' }}
        >
          🚧
        </div>
        <p className="text-sm font-semibold" style={{ color: '#1B1B1F' }}>
          {title}
        </p>
        <p className="text-xs" style={{ color: '#9090A0' }}>
          Em breve
        </p>
      </main>
    </div>
  )
}
