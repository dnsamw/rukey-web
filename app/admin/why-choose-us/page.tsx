'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Toast from '@/components/admin/ui/Toast'
import { defaultWhyChooseUsConfig, type WhyChooseUsConfig } from '@/types/page-config'

const AVAILABLE_ICONS = [
  'Clock', 'Leaf', 'Users', 'Headphones', 'ClipboardCheck', 'Star',
  'Shield', 'CheckCircle', 'Award', 'Zap', 'Heart', 'Globe',
  'Truck', 'Wrench', 'ThumbsUp', 'Sparkles',
]

export default function WhyChooseUsAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<WhyChooseUsConfig>(defaultWhyChooseUsConfig)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'why_choose_us')
          .maybeSingle()

        if (data?.value) {
          const value = data.value as Partial<WhyChooseUsConfig>
          setConfig({
            ...defaultWhyChooseUsConfig,
            ...value,
            reasons: value.reasons ?? defaultWhyChooseUsConfig.reasons,
            testimonial: {
              ...defaultWhyChooseUsConfig.testimonial,
              ...(value.testimonial ?? {}),
            },
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('site_settings')
      .update({ value: config, updated_at: new Date().toISOString() })
      .eq('key', 'why_choose_us')
      .select('id')

    let finalError = error
    if (!error && (!data || data.length === 0)) {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert({ key: 'why_choose_us', value: config })
      finalError = insertError
    }

    if (!finalError) {
      await fetch('/api/revalidate', { method: 'POST' })
      setToast({ message: 'Why Choose Us section saved!', type: 'success' })
    } else {
      setToast({ message: 'Failed to save settings.', type: 'error' })
    }
    setSaving(false)
  }

  const updateReason = (index: number, field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      reasons: prev.reasons.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    }))
  }

  const addReason = () => {
    setConfig((prev) => ({
      ...prev,
      reasons: [...prev.reasons, { icon: 'Star', title: '', description: '' }],
    }))
  }

  const removeReason = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      reasons: prev.reasons.filter((_, i) => i !== index),
    }))
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all'
  const labelClass = 'block text-xs font-semibold text-[var(--color-secondary)] mb-1.5'
  const sectionClass = 'bg-white rounded-2xl border border-gray-100 shadow-sm p-6'

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
        <PageHeader
          title="Why Choose Us"
          subtitle="Edit the section heading, reason cards, image, and testimonial."
          action={
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          }
        />

        {/* Section heading */}
        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Section Heading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Eyebrow Label</label>
              <input
                className={inputClass}
                value={config.eyebrow}
                onChange={(e) => setConfig((prev) => ({ ...prev, eyebrow: e.target.value }))}
                placeholder="Why Us"
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={config.title}
                onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="The Rukey Difference"
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Section Image</h2>
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              className={inputClass}
              value={config.image_url}
              onChange={(e) => setConfig((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          {config.image_url && (
            <div className="mt-4 rounded-xl overflow-hidden h-40 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={config.image_url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Reason cards */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Reason Cards</h2>
            <button
              type="button"
              onClick={addReason}
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <Plus size={13} /> Add Card
            </button>
          </div>

          <div className="space-y-4">
            {config.reasons.map((reason, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-gray-300 shrink-0" />
                  <span className="text-xs font-semibold text-gray-400">Card {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeReason(index)}
                    className="ml-auto w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
                  <div>
                    <label className={labelClass}>Icon</label>
                    <select
                      className={inputClass}
                      value={reason.icon}
                      onChange={(e) => updateReason(index, 'icon', e.target.value)}
                    >
                      {AVAILABLE_ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={inputClass}
                      value={reason.title}
                      onChange={(e) => updateReason(index, 'title', e.target.value)}
                      placeholder="e.g. Flexible Scheduling"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={2}
                    className={`${inputClass} resize-none`}
                    value={reason.description}
                    onChange={(e) => updateReason(index, 'description', e.target.value)}
                    placeholder="Short description..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial card */}
        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Floating Testimonial Card</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Quote</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={config.testimonial.quote}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    testimonial: { ...prev.testimonial, quote: e.target.value },
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Author Name</label>
                <input
                  className={inputClass}
                  value={config.testimonial.author_name}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, author_name: e.target.value },
                    }))
                  }
                  placeholder="Sarah J."
                />
              </div>
              <div>
                <label className={labelClass}>Author Role</label>
                <input
                  className={inputClass}
                  value={config.testimonial.author_role}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, author_role: e.target.value },
                    }))
                  }
                  placeholder="Operations Manager, Melbourne"
                />
              </div>
              <div>
                <label className={labelClass}>Initials (avatar)</label>
                <input
                  className={inputClass}
                  value={config.testimonial.author_initials}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, author_initials: e.target.value.slice(0, 3) },
                    }))
                  }
                  placeholder="SJ"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </AdminShell>
  )
}
