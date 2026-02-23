'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Images, Layers, Star,
  FileText, MessageSquare, Settings, X, ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Hero Slides', href: '/admin/hero', icon: Images },
  { label: 'Services', href: '/admin/services', icon: Layers },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Quote Requests', href: '/admin/quotes', icon: FileText },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
]

type Props = { open: boolean; onClose: () => void }

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <div>
            <span className="block text-white font-bold text-sm leading-none">CleanPro</span>
            <span className="block text-gray-500 text-xs mt-0.5">Admin Panel</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 shrink-0">
        <div className="bg-gray-800 rounded-xl p-4 text-xs text-gray-400">
          <p className="font-semibold text-gray-300 mb-1">CleanPro CMS</p>
          <p>Logged in as admin</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#111827] shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="relative w-60 bg-[#111827] flex flex-col h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
