import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#1E3A5F] via-[#F97316] to-[#1E3A5F]" />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full text-center">

          {/* Large 404 */}
          <div className="relative mb-8">
            <div className="text-[160px] sm:text-[200px] font-black text-gray-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#F97316] text-white px-6 py-3 rounded-2xl shadow-xl">
                <Search size={32} className="mx-auto mb-1" />
                <span className="text-sm font-bold block">Page Not Found</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-black text-[#1E3A5F] mb-3">
            Oops! This page doesn't exist
          </h1>
          <p className="text-gray-500 leading-relaxed mb-10 max-w-md mx-auto">
            The page you're looking for may have been moved, deleted, or never existed.
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#EA6C0A] transition-all shadow-md hover:shadow-lg"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#1E3A5F] text-[#1E3A5F] px-8 py-3.5 rounded-full font-bold hover:bg-[#1E3A5F] hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
              Contact Us
            </Link>
          </div>

          {/* Helpful links */}
          <div className="border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-400 mb-4 font-medium">Or try one of these pages:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Our Services', href: '/services' },
                { label: 'About Us', href: '/about' },
                { label: 'Get a Quote', href: '/get-a-quote' },
                { label: 'Careers', href: '/careers' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl hover:bg-[#F97316]/10 hover:text-[#F97316] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom footer strip */}
      <div className="bg-[#1E3A5F] text-center py-4">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Rukey Facility Services. All rights reserved.
        </p>
      </div>
    </div>
  )
}