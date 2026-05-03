'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import Toast from '@/components/admin/ui/Toast'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react'

type Testimonial = {
  id: string
  name: string
  role: string
  company: string
  quote: string
  rating: number
  initials: string
  color: string
  is_active: boolean
  order: number
}

const colorOptions = [
  { label: 'Navy', value: 'bg-[var(--color-secondary)]' },
  { label: 'Orange', value: 'bg-[var(--color-primary)]' },
  { label: 'Green', value: 'bg-emerald-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Blue', value: 'bg-blue-500' },
]

const emptyForm = {
  name: '', role: '', company: '', quote: '',
  rating: 5, initials: '', color: 'bg-[var(--color-secondary)]',
}

export default function TestimonialsEditorPage() {
  const supabase = createClient()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    setToast({ message, type })

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('testimonials').select('*').order('order', { ascending: true })
    setTestimonials(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const autoInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({ name: t.name, role: t.role, company: t.company, quote: t.quote, rating: t.rating, initials: t.initials, color: t.color })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.quote) {
      showToast('Name and quote are required.', 'error')
      return
    }
    setSaving(true)
    const payload = { ...form, initials: form.initials || autoInitials(form.name) }

    if (editing) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id)
      if (error) { showToast('Failed to update.', 'error'); setSaving(false); return }
      showToast('Testimonial updated!')
    } else {
      const maxOrder = testimonials.length ? Math.max(...testimonials.map((t) => t.order)) : 0
      const { error } = await supabase.from('testimonials').insert({ ...payload, is_active: true, order: maxOrder + 1 })
      if (error) { showToast('Failed to create.', 'error'); setSaving(false); return }
      showToast('Testimonial added!')
    }

    setSaving(false)
    setModalOpen(false)
    fetch()
  }

  const handleToggle = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_active: !t.is_active }).eq('id', t.id)
    fetch()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('testimonials').delete().eq('id', deleteTarget.id)
    showToast('Testimonial deleted.')
    setDeleting(false)
    setDeleteTarget(null)
    fetch()
  }

  const inputClass = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
  const labelClass = "block text-xs font-semibold text-[var(--color-secondary)] mb-1.5"

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Testimonials"
          subtitle="Manage client reviews shown on your website."
          action={
            <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md">
              <Plus size={16} /> Add Testimonial
            </button>
          }
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 ${!t.is_active ? 'opacity-60' : ''}`}>
                <div className={`${t.color} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-[var(--color-secondary)] text-sm">{t.name}</span>
                        <span className="text-gray-400 text-xs">— {t.role}, {t.company}</span>
                        <div className="flex gap-0.5">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} size={11} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                          {t.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm italic truncate max-w-xl">"{t.quote}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleToggle(t)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                        {t.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(t)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!testimonials.length && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm mb-4">No testimonials yet.</p>
                <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
                  <Plus size={16} /> Add Testimonial
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name <span className="text-[var(--color-primary)]">*</span></label>
              <input className={inputClass} placeholder="Sarah Johnson" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, initials: autoInitials(e.target.value) }))} />
            </div>
            <div>
              <label className={labelClass}>Initials</label>
              <input className={inputClass} placeholder="SJ" maxLength={2} value={form.initials}
                onChange={(e) => setForm((p) => ({ ...p, initials: e.target.value.toUpperCase() }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Title</label>
              <input className={inputClass} placeholder="Operations Manager" value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input className={inputClass} placeholder="Acme Corp" value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Quote <span className="text-[var(--color-primary)]">*</span></label>
            <textarea className={`${inputClass} resize-none`} rows={4} placeholder="What did they say about your service?"
              value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => setForm((p) => ({ ...p, rating: r }))}>
                    <Star size={22} className={r <= form.rating ? 'text-[var(--color-primary)] fill-[var(--color-primary)]' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Avatar Color</label>
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                    className={`w-7 h-7 rounded-full ${c.value} border-2 transition-all ${form.color === c.value ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Delete Testimonial" message={`Delete the testimonial from "${deleteTarget?.name}"? This cannot be undone.`} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminShell>
  )
}
