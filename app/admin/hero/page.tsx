'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import Toast from '@/components/admin/ui/Toast'
import ImageUploader from '@/components/admin/editors/ImageUploader'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import Image from 'next/image'

type Slide = {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
  order: number
  is_active: boolean
}

const empty: Omit<Slide, 'id' | 'order' | 'is_active'> = {
  title: '', subtitle: '', description: '', image_url: '',
}

export default function HeroEditorPage() {
  const supabase = createClient()
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Slide | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    setToast({ message, type })

  const fetchSlides = useCallback(async () => {
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order', { ascending: true })
    setSlides(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSlides() }, [fetchSlides])

  const openAdd = () => {
    setEditingSlide(null)
    setForm(empty)
    setModalOpen(true)
  }

  const openEdit = (slide: Slide) => {
    setEditingSlide(slide)
    setForm({ title: slide.title, subtitle: slide.subtitle, description: slide.description, image_url: slide.image_url })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.subtitle || !form.image_url) {
      showToast('Please fill in all required fields.', 'error')
      return
    }
    setSaving(true)

    if (editingSlide) {
      const { error } = await supabase
        .from('hero_slides')
        .update(form)
        .eq('id', editingSlide.id)
      if (error) { showToast('Failed to update slide.', 'error'); setSaving(false); return }
      showToast('Slide updated successfully!')
    } else {
      const maxOrder = slides.length ? Math.max(...slides.map((s) => s.order)) : 0
      const { error } = await supabase
        .from('hero_slides')
        .insert({ ...form, order: maxOrder + 1, is_active: true })
      if (error) { showToast('Failed to create slide.', 'error'); setSaving(false); return }
      showToast('Slide created successfully!')
    }

    setSaving(false)
    setModalOpen(false)
    fetchSlides()
  }

  const handleToggleActive = async (slide: Slide) => {
    await supabase
      .from('hero_slides')
      .update({ is_active: !slide.is_active })
      .eq('id', slide.id)
    fetchSlides()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('hero_slides').delete().eq('id', deleteTarget.id)
    if (error) { showToast('Failed to delete slide.', 'error') }
    else { showToast('Slide deleted.') }
    setDeleting(false)
    setDeleteTarget(null)
    fetchSlides()
  }

  const inputClass = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
  const labelClass = "block text-xs font-semibold text-[var(--color-secondary)] mb-1.5"

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Hero Slides"
          subtitle="Manage the rotating banner images on your home page."
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md"
            >
              <Plus size={16} /> Add Slide
            </button>
          }
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`bg-white rounded-2xl border shadow-sm flex overflow-hidden transition-all ${
                  slide.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'
                }`}
              >
                {/* Drag handle */}
                <div className="flex items-center px-3 text-gray-300 cursor-grab">
                  <GripVertical size={18} />
                </div>

                {/* Thumbnail */}
                <div className="relative w-32 h-24 shrink-0">
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 px-5 py-4 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[var(--color-secondary)]">{slide.title}</span>
                        <span className="text-[var(--color-primary)] font-bold">{slide.subtitle}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          slide.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {slide.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm truncate max-w-md">{slide.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleActive(slide)}
                        title={slide.is_active ? 'Hide slide' : 'Show slide'}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                      >
                        {slide.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => openEdit(slide)}
                        className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(slide)}
                        className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!slides.length && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm mb-4">No slides yet. Add your first hero slide.</p>
                <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
                  <Plus size={16} /> Add Slide
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlide ? 'Edit Slide' : 'Add New Slide'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title <span className="text-[var(--color-primary)]">*</span></label>
              <input
                className={inputClass}
                placeholder="e.g. Office"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle <span className="text-[var(--color-primary)]">*</span></label>
              <input
                className={inputClass}
                placeholder="e.g. Cleaning"
                value={form.subtitle}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Short description shown on the slide..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <ImageUploader
            label="Slide Image *"
            value={form.image_url}
            onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingSlide ? 'Save Changes' : 'Add Slide'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Slide"
        message={`Are you sure you want to delete the "${deleteTarget?.title} ${deleteTarget?.subtitle}" slide? This cannot be undone.`}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminShell>
  )
}
