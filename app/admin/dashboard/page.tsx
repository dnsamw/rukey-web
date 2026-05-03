import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/layout/AdminShell'
import StatCard from '@/components/admin/ui/StatCard'
import { Images, Layers, Star, FileText, MessageSquare, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [
    { count: slidesCount },
    { count: servicesCount },
    { count: testimonialsCount },
    { count: quotesCount },
    { count: messagesCount },
    { data: recentQuotes },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('hero_slides').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quote_requests').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { title: 'Hero Slides', value: slidesCount ?? 0, subtitle: 'Active slides in carousel', icon: Images, color: 'bg-[var(--color-secondary)]' },
    { title: 'Services', value: servicesCount ?? 0, subtitle: 'Active service listings', icon: Layers, color: 'bg-[var(--color-primary)]' },
    { title: 'Testimonials', value: testimonialsCount ?? 0, subtitle: 'Client reviews', icon: Star, color: 'bg-emerald-500' },
    { title: 'New Quotes', value: quotesCount ?? 0, subtitle: 'Awaiting response', icon: FileText, color: 'bg-purple-500' },
    { title: 'New Messages', value: messagesCount ?? 0, subtitle: 'Unread contact messages', icon: MessageSquare, color: 'bg-blue-500' },
  ]

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-black text-[var(--color-secondary)]">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your website content and activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent quotes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-[var(--color-secondary)]">Recent Quote Requests</h2>
              <Link href="/admin/quotes" className="text-xs text-[var(--color-primary)] font-semibold hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentQuotes?.length ? recentQuotes.map((q: any) => (
                <div key={q.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{q.name}</div>
                    <div className="text-xs text-gray-400">{q.service ?? 'General enquiry'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      q.status === 'new' ? 'bg-orange-100 text-[var(--color-primary)]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {q.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(q.created_at).toLocaleDateString('en-AU')}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-sm text-gray-400">No quote requests yet</div>
              )}
            </div>
          </div>

          {/* Recent messages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-[var(--color-secondary)]">Recent Messages</h2>
              <Link href="/admin/messages" className="text-xs text-[var(--color-primary)] font-semibold hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentMessages?.length ? recentMessages.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{m.name}</div>
                    <div className="text-xs text-gray-400 truncate max-w-48">{m.message}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      m.status === 'new' ? 'bg-orange-100 text-[var(--color-primary)]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {m.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(m.created_at).toLocaleDateString('en-AU')}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-sm text-gray-400">No messages yet</div>
              )}
            </div>
          </div>

        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Manage Slides', href: '/admin/hero', icon: Images, color: 'bg-[var(--color-secondary)]' },
              { label: 'Manage Services', href: '/admin/services', icon: Layers, color: 'bg-[var(--color-primary)]' },
              { label: 'View Quotes', href: '/admin/quotes', icon: FileText, color: 'bg-purple-500' },
              { label: 'Site Settings', href: '/admin/settings', icon: Star, color: 'bg-emerald-500' },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-3 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600 text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </AdminShell>
  )
}