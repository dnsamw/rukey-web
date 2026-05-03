'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import { Eye, Clock, Mail, Phone, MapPin, Building2 } from 'lucide-react'

type Quote = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  service: string | null
  facility_size: string | null
  frequency: string | null
  address: string | null
  message: string | null
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  new: 'bg-orange-100 text-[var(--color-primary)]',
  contacted: 'bg-blue-100 text-blue-600',
  completed: 'bg-emerald-100 text-emerald-600',
  archived: 'bg-gray-100 text-gray-400',
}

export default function QuotesPage() {
  const supabase = createClient()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Quote | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchQuotes = useCallback(async () => {
    const { data } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setQuotes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchQuotes() }, [fetchQuotes])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('quote_requests').update({ status }).eq('id', id)
    setSelected((prev) => prev ? { ...prev, status } : null)
    fetchQuotes()
  }

  const filtered = filterStatus === 'all' ? quotes : quotes.filter((q) => q.status === filterStatus)

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Quote Requests" subtitle="Incoming quote requests from your website contact form." />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'new', 'contacted', 'completed', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === s
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]'
              }`}
            >
              {s} {s === 'all' ? `(${quotes.length})` : `(${quotes.filter((q) => q.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.length ? (
              <div className="divide-y divide-gray-50">
                {filtered.map((q) => (
                  <div key={q.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {q.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[var(--color-secondary)] text-sm">{q.name}</span>
                          {q.company && <span className="text-gray-400 text-xs">· {q.company}</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[q.status] ?? 'bg-gray-100 text-gray-400'}`}>
                            {q.status}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs flex items-center gap-3 mt-0.5 flex-wrap">
                          <span>{q.service ?? 'General enquiry'}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(q.created_at).toLocaleDateString('en-AU')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(q)}
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-colors shrink-0 ml-4"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-sm">No quote requests found.</div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Quote Request Details" size="md">
        {selected && (
          <div className="space-y-5">
            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: Mail, label: 'Email', value: selected.email, href: `mailto:${selected.email}` },
                { icon: Phone, label: 'Phone', value: selected.phone ?? '—', href: selected.phone ? `tel:${selected.phone}` : undefined },
                { icon: Building2, label: 'Company', value: selected.company ?? '—' },
                { icon: MapPin, label: 'Address', value: selected.address ?? '—' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Icon size={12} /> {label}
                  </div>
                  {href ? (
                    <a href={href} className="font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">{value}</a>
                  ) : (
                    <span className="font-semibold text-[var(--color-secondary)]">{value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Service details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              {[
                { label: 'Service', value: selected.service },
                { label: 'Facility Size', value: selected.facility_size },
                { label: 'Frequency', value: selected.frequency },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-400 w-28 shrink-0">{label}</span>
                  <span className="font-semibold text-[var(--color-secondary)]">{value}</span>
                </div>
              ))}
            </div>

            {/* Message */}
            {selected.message && (
              <div>
                <div className="text-xs font-semibold text-[var(--color-secondary)] mb-2">Additional Notes</div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
                  {selected.message}
                </div>
              </div>
            )}

            {/* Status update */}
            <div>
              <div className="text-xs font-semibold text-[var(--color-secondary)] mb-2">Update Status</div>
              <div className="flex gap-2 flex-wrap">
                {['new', 'contacted', 'completed', 'archived'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      selected.status === s
                        ? 'bg-[var(--color-secondary)] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply button */}
            
            <a  href={`mailto:${selected.email}?subject=Re: Your Rukey Quote Request`}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Mail size={16} /> Reply via Email
            </a>
          </div>
        )}
      </Modal>
    </AdminShell>
  )
}
