'use client'

import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error'

type Props = {
  message: string
  type: ToastType
  onClose: () => void
}

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-sm font-medium animate-in slide-in-from-bottom-4 ${
      type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
    }`}>
      {type === 'success'
        ? <CheckCircle2 size={18} className="shrink-0" />
        : <XCircle size={18} className="shrink-0" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={15} />
      </button>
    </div>
  )
}
