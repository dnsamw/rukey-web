'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import Toast from '@/components/admin/ui/Toast'
import ImageUploader from '@/components/admin/editors/ImageUploader'
import ConfigurableBanner from '@/components/public/shared/ConfigurableBanner'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import Image from 'next/image'
import type { SiteBanner } from '@/types/banner'

type BannerLayout = 'text' | 'image_link' | 'image_cta'

type Slide = {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
  order: number
  is_active: boolean
  banner_enabled: boolean
  banner_layout: BannerLayout
  banner_show_badge: boolean
  banner_badge: string
  banner_title: string
  banner_description: string
  banner_cta_label: string
  banner_cta_href: string
  banner_bg_color: string
  banner_text_color: string
  banner_accent_color: string
  banner_image_url: string
  banner_image_href: string
  banner_transparent_bg: boolean
  banner_drop_shadow: boolean
}

const empty: Omit<Slide, 'id' | 'order' | 'is_active'> = {
  title: '', subtitle: '', description: '', image_url: '',
  banner_enabled: false,
  banner_layout: 'text',
  banner_show_badge: true,
  banner_badge: '', banner_title: '', banner_description: '',
  banner_cta_label: '', banner_cta_href: '',
  banner_bg_color: '#1E3A5F', banner_text_color: '#FFFFFF', banner_accent_color: '#F97316',
  banner_image_url: '', banner_image_href: '',
  banner_transparent_bg: false, banner_drop_shadow: false,
}

const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all'
const labelClass = 'block text-xs font-semibold text-[var(--color-secondary)] mb-1.5'

function ColorField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-9 w-12 shrink-0 rounded-lg border border-gray-200 cursor-pointer p-0.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  )
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

  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) =>
    setForm((p) => ({ ...p, [k]: v }))

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
    setForm({
      title: slide.title, subtitle: slide.subtitle,
      description: slide.description, image_url: slide.image_url,
      banner_enabled: slide.banner_enabled ?? false,
      banner_layout: slide.banner_layout ?? 'text',
      banner_show_badge: slide.banner_show_badge ?? true,
      banner_badge: slide.banner_badge ?? '',
      banner_title: slide.banner_title ?? '',
      banner_description: slide.banner_description ?? '',
      banner_cta_label: slide.banner_cta_label ?? '',
      banner_cta_href: slide.banner_cta_href ?? '',
      banner_bg_color: slide.banner_bg_color ?? '#1E3A5F',
      banner_text_color: slide.banner_text_color ?? '#FFFFFF',
      banner_accent_color: slide.banner_accent_color ?? '#F97316',
      banner_image_url: slide.banner_image_url ?? '',
      banner_image_href: slide.banner_image_href ?? '',
      banner_transparent_bg: slide.banner_transparent_bg ?? false,
      banner_drop_shadow: slide.banner_drop_shadow ?? false,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.subtitle || !form.image_url) {
      showToast('Please fill in all required fields.', 'error')
      return
    }
    setSaving(true)

    if (editingSlide) {
      const { error } = await supabase.from('hero_slides').update(form).eq('id', editingSlide.id)
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
    await supabase.from('hero_slides').update({ is_active: !slide.is_active }).eq('id', slide.id)
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

  // Build a SiteBanner from current form for the live preview
  const previewBanner: SiteBanner = {
    id: 'preview',
    placement: 'home_after_services',
    is_enabled: true,
    badge: form.banner_badge,
    title: form.banner_title,
    description: form.banner_description,
    cta_label: form.banner_cta_label,
    cta_href: form.banner_cta_href || '#',
    background_color: form.banner_bg_color,
    text_color: form.banner_text_color,
    accent_color: form.banner_accent_color,
    layout: form.banner_layout,
    show_badge: form.banner_show_badge,
    image_url: form.banner_image_url || undefined,
    image_href: form.banner_image_href || undefined,
    transparent_bg: form.banner_transparent_bg,
    drop_shadow: form.banner_drop_shadow,
  }

  const showPreviewEmpty =
    (form.banner_layout === 'text' && !form.banner_title) ||
    ((form.banner_layout === 'image_link' || form.banner_layout === 'image_cta') && !form.banner_image_url)

  const LAYOUT_TABS: { key: BannerLayout; label: string }[] = [
    { key: 'text', label: 'Text' },
    { key: 'image_link', label: 'Image Only' },
    { key: 'image_cta', label: 'Image + CTA' },
  ]

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
                <div className="flex items-center px-3 text-gray-300 cursor-grab">
                  <GripVertical size={18} />
                </div>
                <div className="relative w-32 h-24 shrink-0">
                  <Image src={slide.image_url} alt={slide.title} fill className="object-cover" />
                </div>
                <div className="flex-1 px-5 py-4 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-[var(--color-secondary)]">{slide.title}</span>
                        <span className="text-[var(--color-primary)] font-bold">{slide.subtitle}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          slide.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {slide.is_active ? 'Active' : 'Hidden'}
                        </span>
                        {slide.banner_enabled && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-500">
                            Banner On
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm truncate max-w-md">{slide.description}</p>
                    </div>
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
                <button
                  onClick={openAdd}
                  className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors"
                >
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
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title <span className="text-[var(--color-primary)]">*</span></label>
              <input className={inputClass} placeholder="e.g. Office" value={form.title}
                onChange={(e) => set('title', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Subtitle <span className="text-[var(--color-primary)]">*</span></label>
              <input className={inputClass} placeholder="e.g. Cleaning" value={form.subtitle}
                onChange={(e) => set('subtitle', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} resize-none`} rows={2}
              placeholder="Short description shown on the slide..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)} />
          </div>

          <ImageUploader
            label="Slide Background Image *"
            value={form.image_url}
            onChange={(url) => set('image_url', url)}
          />

          {/* Banner Designer */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            {/* Header + master toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--color-secondary)]">Promotional Banner</p>
                <p className="text-xs text-gray-400 mt-0.5">Shown to the right of this slide</p>
              </div>
              <button
                type="button"
                onClick={() => set('banner_enabled', !form.banner_enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  form.banner_enabled ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  form.banner_enabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {form.banner_enabled && (
              <div className="space-y-4">
                {/* Layout picker */}
                <div>
                  <p className={labelClass}>Layout</p>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    {LAYOUT_TABS.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set('banner_layout', key)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          form.banner_layout === key
                            ? 'bg-white text-[var(--color-secondary)] shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Two-column: form fields | live preview */}
                <div className="grid grid-cols-[1fr_260px] gap-5 items-start">

                  {/* ── Left: form fields ── */}
                  <div className="space-y-3">

                    {/* TEXT layout fields */}
                    {form.banner_layout === 'text' && (
                      <>
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <label className={labelClass}>Badge Label</label>
                            <input className={inputClass} placeholder="e.g. Limited Offer"
                              value={form.banner_badge}
                              onChange={(e) => set('banner_badge', e.target.value)} />
                          </div>
                          <label className="flex items-center gap-2 pb-2.5 text-xs text-gray-600 cursor-pointer shrink-0 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={form.banner_show_badge}
                              onChange={(e) => set('banner_show_badge', e.target.checked)}
                              className="w-3.5 h-3.5 rounded accent-[var(--color-primary)]"
                            />
                            Show badge
                          </label>
                        </div>
                        <div>
                          <label className={labelClass}>Banner Title</label>
                          <input className={inputClass} placeholder="e.g. 20% Off This Month"
                            value={form.banner_title}
                            onChange={(e) => set('banner_title', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelClass}>Description</label>
                          <textarea className={`${inputClass} resize-none`} rows={2}
                            placeholder="Short promotional message..."
                            value={form.banner_description}
                            onChange={(e) => set('banner_description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>CTA Button Label</label>
                            <input className={inputClass} placeholder="e.g. Claim Offer"
                              value={form.banner_cta_label}
                              onChange={(e) => set('banner_cta_label', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelClass}>CTA Button Link</label>
                            <input className={inputClass} placeholder="/get-a-quote"
                              value={form.banner_cta_href}
                              onChange={(e) => set('banner_cta_href', e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <ColorField label="Background" value={form.banner_bg_color}
                            onChange={(v) => set('banner_bg_color', v)} />
                          <ColorField label="Text Color" value={form.banner_text_color}
                            onChange={(v) => set('banner_text_color', v)} />
                          <ColorField label="Accent Color" value={form.banner_accent_color}
                            onChange={(v) => set('banner_accent_color', v)} />
                        </div>
                      </>
                    )}

                    {/* IMAGE ONLY layout fields */}
                    {form.banner_layout === 'image_link' && (
                      <>
                        <ImageUploader
                          label="Banner Image"
                          value={form.banner_image_url}
                          onChange={(url) => set('banner_image_url', url)}
                        />
                        <div>
                          <label className={labelClass}>Link URL (wraps the whole image)</label>
                          <input className={inputClass} placeholder="https://example.com or /services"
                            value={form.banner_image_href}
                            onChange={(e) => set('banner_image_href', e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* IMAGE + CTA layout fields */}
                    {form.banner_layout === 'image_cta' && (
                      <>
                        <ImageUploader
                          label="Banner Image"
                          value={form.banner_image_url}
                          onChange={(url) => set('banner_image_url', url)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>CTA Button Label</label>
                            <input className={inputClass} placeholder="e.g. Get a Quote"
                              value={form.banner_cta_label}
                              onChange={(e) => set('banner_cta_label', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelClass}>CTA Button Link</label>
                            <input className={inputClass} placeholder="/get-a-quote"
                              value={form.banner_cta_href}
                              onChange={(e) => set('banner_cta_href', e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <ColorField label="Accent Color (CTA)" value={form.banner_accent_color}
                            onChange={(v) => set('banner_accent_color', v)} />
                          <ColorField label="Background" value={form.banner_bg_color}
                            onChange={(v) => set('banner_bg_color', v)} />
                        </div>
                      </>
                    )}

                    {/* Visual options — all layouts */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 border-t border-gray-100">
                      {form.banner_layout !== 'image_link' && (
                        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.banner_transparent_bg}
                            onChange={(e) => set('banner_transparent_bg', e.target.checked)}
                            className="w-3.5 h-3.5 rounded accent-[var(--color-primary)]"
                          />
                          Transparent Background
                        </label>
                      )}
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.banner_drop_shadow}
                          onChange={(e) => set('banner_drop_shadow', e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-[var(--color-primary)]"
                        />
                        Drop Shadow
                      </label>
                    </div>
                  </div>

                  {/* ── Right: live preview ── */}
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wide mb-2.5">
                      Live Preview
                    </p>
                    <div
                      className="rounded-xl overflow-hidden"
                      style={form.banner_transparent_bg ? {
                        backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)',
                        backgroundSize: '16px 16px',
                      } : { backgroundColor: '#f9fafb' }}
                    >
                      {showPreviewEmpty ? (
                        <div className="flex items-center justify-center h-28 text-gray-400 text-xs p-4 text-center">
                          {form.banner_layout === 'text'
                            ? 'Add a title to see the preview'
                            : 'Add an image to see the preview'}
                        </div>
                      ) : (
                        <ConfigurableBanner banner={previewBanner} compact />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
