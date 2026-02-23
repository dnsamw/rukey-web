'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-[#1E3A5F] mb-3">Something went wrong</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          We encountered an unexpected error. Please try again or head back to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#EA6C0A] transition-all shadow-md"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#1E3A5F] text-[#1E3A5F] px-8 py-3.5 rounded-full font-bold hover:bg-[#1E3A5F] hover:text-white transition-all"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}