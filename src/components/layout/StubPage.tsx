import TopHeader from './TopHeader'

type StubPageProps = {
  title: string
}

export default function StubPage({ title }: StubPageProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#0F0F15' }}>
      <TopHeader />
      <main className="flex-1 flex flex-col items-center justify-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38' }}
        >
          🚧
        </div>
        <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>
          {title}
        </p>
        <p className="text-xs" style={{ color: '#6B6B80' }}>
          Em breve
        </p>
      </main>
    </div>
  )
}
