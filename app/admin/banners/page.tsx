'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import Toast from '@/components/admin/ui/Toast'
import { Save, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react'
import type { SiteBanner } from '@/types/banner'
import { BANNER_PLACEMENTS, DEFAULT_SITE_BANNERS } from '@/types/banner'

const bannerLabels: Record<string, string> = {
  hero_right: 'Hero Right Side (Desktop) + Mobile Card',
  home_after_services: 'Home: After Services',
  home_after_about: 'Home: After About',
  home_before_contact: 'Home: Before Contact',
  about_after_story: 'About: After Story Section',
  services_after_grid: 'Services: After Services Grid',
  careers_after_roles: 'Careers: After Open Roles',
  contact_after_form: 'Contact: After Contact Section',
  service_detail_after_content: 'Service Detail: After Main Content',
}

export default function BannersPage() {
  const router = useRouter()
  const supabase = createClient()
  const [banners, setBanners] = useState<SiteBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBanner, setEditingBanner] = useState<SiteBanner | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('placement', { ascending: true })

      if (error) {
        console.error('Fetch error:', error)
        throw error
      }

      console.log('Fetched banners from DB:', data)

      const mappedBanners = BANNER_PLACEMENTS.map(placement => {
        const existing = data?.find(b => b.placement === placement)
        const defaultBanner = DEFAULT_SITE_BANNERS.find(b => b.placement === placement)
        return (existing || defaultBanner) as SiteBanner
      })

      console.log('Mapped banners:', mappedBanners)
      setBanners(mappedBanners)
    } catch (error) {
      console.error('Failed to fetch banners:', error)
      setToast({ message: 'Failed to load banners', type: 'error' })
      setBanners(DEFAULT_SITE_BANNERS)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (banner: SiteBanner) => {
    setEditingBanner(banner)
    setIsModalOpen(true)
  }

  const handleSave = async (banner: SiteBanner) => {
    setIsSaving(true)
    try {
      console.log('Saving banner:', banner)

      const payload = {
        placement: banner.placement,
        is_enabled: banner.is_enabled,
        badge: banner.badge || '',
        title: banner.title || '',
        description: banner.description || '',
        cta_label: banner.cta_label || '',
        cta_href: banner.cta_href || '',
        background_color: banner.background_color || '#ffffff',
        text_color: banner.text_color || '#000000',
        accent_color: banner.accent_color || '#F97316',
        updated_at: new Date().toISOString(),
      }

      const { error: upsertError, data: upsertData } = await supabase
        .from('banners')
        .upsert(payload, { onConflict: 'placement' })
        .select()

      console.log('Upsert result:', { error: upsertError, data: upsertData })

      if (upsertError) throw upsertError

      console.log('Triggering revalidation...')
      await fetch('/api/revalidate', { method: 'POST' })

      setToast({ message: 'Banner saved successfully', type: 'success' })
      setIsModalOpen(false)
      setEditingBanner(null)
      await fetchBanners()
      router.refresh()
    } catch (error) {
      console.error('Failed to save banner:', error)
      setToast({ message: `Failed to save banner: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = async (placement: string, isEnabled: boolean) => {
    try {
      const current = banners.find((b) => b.placement === placement)
      const fallback = DEFAULT_SITE_BANNERS.find((b) => b.placement === placement)
      const source = current ?? fallback

      if (!source) {
        throw new Error(`Unknown banner placement: ${placement}`)
      }

      const payload = {
        placement: source.placement,
        is_enabled: isEnabled,
        badge: source.badge || '',
        title: source.title || '',
        description: source.description || '',
        cta_label: source.cta_label || '',
        cta_href: source.cta_href || '',
        background_color: source.background_color || '#ffffff',
        text_color: source.text_color || '#000000',
        accent_color: source.accent_color || '#F97316',
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('banners')
        .upsert(payload, { onConflict: 'placement' })

      if (error) throw error

      setBanners(banners.map(b => b.placement === placement ? { ...b, is_enabled: isEnabled } : b))
      await fetch('/api/revalidate', { method: 'POST' })
      setToast({ message: `Banner ${isEnabled ? 'enabled' : 'disabled'}`, type: 'success' })
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle banner:', error)
      setToast({ message: 'Failed to update banner', type: 'error' })
      await fetchBanners()
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const current = banners.find((b) => b.placement === deleteTarget)
      const fallback = DEFAULT_SITE_BANNERS.find((b) => b.placement === deleteTarget)
      const source = current ?? fallback

      if (!source) {
        throw new Error(`Unknown banner placement: ${deleteTarget}`)
      }

      const payload = {
        placement: source.placement,
        is_enabled: false,
        badge: source.badge || '',
        title: source.title || '',
        description: source.description || '',
        cta_label: source.cta_label || '',
        cta_href: source.cta_href || '',
        background_color: source.background_color || '#ffffff',
        text_color: source.text_color || '#000000',
        accent_color: source.accent_color || '#F97316',
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('banners')
        .upsert(payload, { onConflict: 'placement' })

      if (error) throw error

      setBanners(banners.map(b => b.placement === deleteTarget ? { ...b, is_enabled: false } : b))
      await fetch('/api/revalidate', { method: 'POST' })
      setToast({ message: 'Banner disabled', type: 'success' })
      router.refresh()
    } catch (error) {
      console.error('Failed to disable banner:', error)
      setToast({ message: 'Failed to disable banner', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="Banners & Adverts" subtitle="Manage display banners across your website" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">All Banners</h2>

          <div className="space-y-3">
            {banners.map(banner => (
              <div
                key={banner.placement}
                className={`border rounded-xl p-4 flex items-start justify-between gap-3 ${
                  banner.is_enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-70'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-[var(--color-secondary)]">
                      {bannerLabels[banner.placement] || banner.placement}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        banner.is_enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {banner.is_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {banner.title && (
                    <p className="text-sm text-gray-500">{banner.title}</p>
                  )}
                  {banner.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{banner.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(banner.placement, !banner.is_enabled)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    title={banner.is_enabled ? 'Disable' : 'Enable'}
                  >
                    {banner.is_enabled ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100"
                    title="Edit banner"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(banner.placement)}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100"
                    title="Disable banner"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBanner(null)
        }}
        title={editingBanner ? `Edit ${bannerLabels[editingBanner.placement] || editingBanner.placement}` : 'New Banner'}
      >
        {editingBanner && (
          <BannerForm
            banner={editingBanner}
            onSave={handleSave}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingBanner(null)
            }}
            isSaving={isSaving}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Disable Banner"
        message={`Disable the banner "${deleteTarget ? (bannerLabels[deleteTarget] || deleteTarget) : ''}"? It will no longer appear on the site.`}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminShell>
  )
}

function BannerForm({
  banner,
  onSave,
  onCancel,
  isSaving,
}: {
  banner: SiteBanner
  onSave: (banner: SiteBanner) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const [formData, setFormData] = useState(banner)

  const handleChange = (field: keyof SiteBanner, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all'
  const labelClass = 'block text-xs font-semibold text-[var(--color-secondary)] mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Badge</label>
        <input
          type="text"
          value={formData.badge || ''}
          onChange={(e) => handleChange('badge', e.target.value)}
          placeholder="e.g., SPECIAL OFFER"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Banner title"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Banner description"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CTA Label</label>
          <input
            type="text"
            value={formData.cta_label || ''}
            onChange={(e) => handleChange('cta_label', e.target.value)}
            placeholder="e.g., Learn More"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>CTA Link</label>
          <input
            type="text"
            value={formData.cta_href || ''}
            onChange={(e) => handleChange('cta_href', e.target.value)}
            placeholder="e.g., /quote"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.background_color || '#ffffff'}
              onChange={(e) => handleChange('background_color', e.target.value)}
              className="w-12 h-11 rounded-xl border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={formData.background_color || '#ffffff'}
              onChange={(e) => handleChange('background_color', e.target.value)}
              className={`${inputClass} flex-1 font-mono text-xs`}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.text_color || '#000000'}
              onChange={(e) => handleChange('text_color', e.target.value)}
              className="w-12 h-11 rounded-xl border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={formData.text_color || '#000000'}
              onChange={(e) => handleChange('text_color', e.target.value)}
              className={`${inputClass} flex-1 font-mono text-xs`}
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.accent_color || '#F97316'}
              onChange={(e) => handleChange('accent_color', e.target.value)}
              className="w-12 h-11 rounded-xl border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={formData.accent_color || '#F97316'}
              onChange={(e) => handleChange('accent_color', e.target.value)}
              className={`${inputClass} flex-1 font-mono text-xs`}
              placeholder="#F97316"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60 inline-flex items-center gap-2"
          disabled={isSaving}
        >
          <Save size={15} />
          {isSaving ? 'Saving...' : 'Save Banner'}
        </button>
      </div>
    </form>
  )
}
