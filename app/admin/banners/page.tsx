'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import Toast from '@/components/admin/ui/Toast'
import { Edit2, Save } from 'lucide-react'
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

      // Trigger revalidation
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

      // Update local state
      setBanners(banners.map(b => b.placement === placement ? { ...b, is_enabled: isEnabled } : b))
      
      // Trigger revalidation
      await fetch('/api/revalidate', { method: 'POST' })
      
      setToast({ message: `Banner ${isEnabled ? 'enabled' : 'disabled'}`, type: 'success' })
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle banner:', error)
      setToast({ message: 'Failed to update banner', type: 'error' })
      await fetchBanners()
    }
  }

  const handleDelete = async (placement: string) => {
    if (!confirm('Are you sure? This will disable the banner.')) return

    try {
      const current = banners.find((b) => b.placement === placement)
      const fallback = DEFAULT_SITE_BANNERS.find((b) => b.placement === placement)
      const source = current ?? fallback

      if (!source) {
        throw new Error(`Unknown banner placement: ${placement}`)
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

      setBanners(banners.map(b => b.placement === placement ? { ...b, is_enabled: false } : b))
      
      // Trigger revalidation
      await fetch('/api/revalidate', { method: 'POST' })
      
      setToast({ message: 'Banner disabled', type: 'success' })
      router.refresh()
    } catch (error) {
      console.error('Failed to disable banner:', error)
      setToast({ message: 'Failed to disable banner', type: 'error' })
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <PageHeader title="Banners & Adverts" subtitle="Manage display banners across your website" />
        <div className="mt-8 text-center text-gray-400">Loading banners...</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <PageHeader title="Banners & Adverts" subtitle="Manage display banners across your website" />

      <div className="mt-8 grid gap-4">
        {banners.map(banner => (
          <div
            key={banner.placement}
            className="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-lg font-semibold text-[var(--color-secondary)]">
                  {bannerLabels[banner.placement] || banner.placement}
                </h3>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={banner.is_enabled}
                    onChange={(e) => handleToggle(banner.placement, e.target.checked)}
                    className="w-5 h-5 text-[var(--color-primary)] rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {banner.is_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
              
              <div className="space-y-2">
                {banner.title && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="text-gray-600 ml-2">{banner.title}</span>
                  </p>
                )}
                {banner.description && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Description:</span>
                    <span className="text-gray-600 ml-2 line-clamp-1">{banner.description}</span>
                  </p>
                )}
                {banner.cta_label && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">CTA:</span>
                    <span className="text-gray-600 ml-2">{banner.cta_label}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleEdit(banner)}
              className="ml-4 p-3 text-gray-400 hover:text-[var(--color-primary)] hover:bg-orange-50 rounded-lg transition shrink-0"
              title="Edit banner"
            >
              <Edit2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Banner Modal */}
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

      {/* Toast */}
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

// Banner Form Component
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

  const handleChange = (field: keyof SiteBanner, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  const inputClass = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
  const labelClass = "block text-sm font-semibold text-[var(--color-secondary)] mb-2"

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
              className="w-12 h-11 rounded-lg border border-gray-200 cursor-pointer"
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
              className="w-12 h-11 rounded-lg border border-gray-200 cursor-pointer"
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
              className="w-12 h-11 rounded-lg border border-gray-200 cursor-pointer"
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

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium disabled:opacity-50 flex items-center gap-2"
          disabled={isSaving}
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Banner'}
        </button>
      </div>
    </form>
  )
}
