'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
}

export default function Modal({ title, onClose, children, width = 480 }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full rounded-2xl flex flex-col"
        style={{ backgroundColor: '#16161E', border: '1px solid #2A2A38', maxWidth: width }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#2A2A38' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>{title}</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity" style={{ color: '#6B6B80' }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
