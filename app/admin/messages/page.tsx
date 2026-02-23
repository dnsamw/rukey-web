'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import { Eye, Clock, Mail, Phone } from 'lucide-react'

type Message = {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  message: string
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  new: 'bg-orange-100 text-[var(--color-primary)]',
  read: 'bg-blue-100 text-blue-600',
  replied: 'bg-emerald-100 text-emerald-600',
  archived: 'bg-gray-100 text-gray-400',
}

export default function MessagesPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_messages').update({ status }).eq('id', id)
    setSelected((prev) => prev ? { ...prev, status } : null)
    fetchMessages()
  }

  const openMessage = async (m: Message) => {
    setSelected(m)
    if (m.status === 'new') updateStatus(m.id, 'read')
  }

  const filtered = filterStatus === 'all' ? messages : messages.filter((m) => m.status === filterStatus)

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Contact Messages" subtitle="Messages submitted through your website contact form." />

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'new', 'read', 'replied', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === s
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]'
              }`}
            >
              {s} {s === 'all' ? `(${messages.length})` : `(${messages.filter((m) => m.status === s).length})`}
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
                {filtered.map((m) => (
                  <div key={m.id} className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${m.status === 'new' ? 'bg-orange-50/30' : ''}`}>
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${m.status === 'new' ? 'text-[var(--color-secondary)]' : 'text-gray-600'}`}>
                            {m.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[m.status] ?? 'bg-gray-100 text-gray-400'}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs truncate max-w-md mt-0.5">{m.message}</p>
                        <span className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={11} />
                          {new Date(m.created_at).toLocaleDateString('en-AU')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => openMessage(m)}
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-colors shrink-0 ml-4"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-sm">No messages found.</div>
            )}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message Details" size="md">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: Mail, label: 'Email', value: selected.email, href: `mailto:${selected.email}` },
                { icon: Phone, label: 'Phone', value: selected.phone ?? '—', href: selected.phone ? `tel:${selected.phone}` : undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1"><Icon size={12} /> {label}</div>
                  {href
                    ? <a href={href} className="font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">{value}</a>
                    : <span className="font-semibold text-[var(--color-secondary)]">{value}</span>}
                </div>
              ))}
            </div>
            {selected.service && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <span className="text-gray-400">Service: </span>
                <span className="font-semibold text-[var(--color-secondary)]">{selected.service}</span>
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-[var(--color-secondary)] mb-2">Message</div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">{selected.message}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--color-secondary)] mb-2">Update Status</div>
              <div className="flex gap-2 flex-wrap">
                {['new', 'read', 'replied', 'archived'].map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${selected.status === s ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            <a  href={`mailto:${selected.email}?subject=Re: Your CleanPro Enquiry`}
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