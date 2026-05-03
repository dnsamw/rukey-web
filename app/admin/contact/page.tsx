'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Toast from '@/components/admin/ui/Toast'
import {
  defaultContactPageConfig,
  type ContactPageConfig,
} from '@/types/page-config'

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  contact_form: 'Contact Form Section',
  business_hours: 'Business Hours Panel',
  map: 'Map Section',
  banner: 'Configurable Banner',
}

export default function ContactAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<ContactPageConfig>(defaultContactPageConfig)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'contact_page')
          .maybeSingle()

        if (data?.value) {
          const value = data.value as Partial<ContactPageConfig>
          setForm({
            ...defaultContactPageConfig,
            ...value,
            sections: {
              ...defaultContactPageConfig.sections,
              ...(value.sections ?? {}),
            },
            hero: { ...defaultContactPageConfig.hero, ...(value.hero ?? {}) },
            contact: {
              ...defaultContactPageConfig.contact,
              ...(value.contact ?? {}),
              service_options:
                value.contact?.service_options ??
                defaultContactPageConfig.contact.service_options,
            },
            map: { ...defaultContactPageConfig.map, ...(value.map ?? {}) },
            offices: value.offices ?? defaultContactPageConfig.offices,
            business_hours:
              value.business_hours ?? defaultContactPageConfig.business_hours,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [supabase])

  const saveSetting = async (key: string, value: unknown) => {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select('id')

    if (error) return { error }
    if (!data || data.length === 0) {
      return supabase.from('site_settings').insert({ key, value })
    }
    return { error: null }
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: ContactPageConfig = {
      ...form,
      contact: {
        ...form.contact,
        service_options: form.contact.service_options
          .map((item) => item.trim())
          .filter(Boolean),
      },
      offices: form.offices.filter((office) => office.area.trim() || office.address.trim()),
      business_hours: form.business_hours.filter((row) => row.day.trim() || row.hours.trim()),
    }

    const response = await saveSetting('contact_page', payload)

    if (!response.error) {
      await fetch('/api/revalidate', { method: 'POST' })
      setToast({ message: 'Contact page settings saved!', type: 'success' })
    } else {
      setToast({ message: 'Failed to save Contact page settings.', type: 'error' })
    }
    setSaving(false)
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
          title="Contact Page"
          subtitle="Manage contact page content, business hours, and office locations."
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

        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Section Visibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(form.sections).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sections: { ...prev.sections, [key]: e.target.checked },
                    }))
                  }
                  className="w-4 h-4"
                />
                <span>{sectionLabels[key] ?? key}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Hero Content</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                className={inputClass}
                value={form.hero.eyebrow}
                onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, eyebrow: e.target.value } }))}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={form.hero.title}
                onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={form.hero.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))
                }
              />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Contact Form Content</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Section Label</label>
              <input
                className={inputClass}
                value={form.contact.label}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contact: { ...prev.contact, label: e.target.value } }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input
                className={inputClass}
                value={form.contact.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contact: { ...prev.contact, title: e.target.value } }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Section Subtitle</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={form.contact.subtitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contact: { ...prev.contact, subtitle: e.target.value } }))
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass}>Service Options</label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        service_options: [...prev.contact.service_options, ''],
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
                >
                  <Plus size={13} /> Add Option
                </button>
              </div>

              <div className="space-y-2">
                {form.contact.service_options.map((option, index) => (
                  <div key={`${option}-${index}`} className="flex gap-2">
                    <input
                      className={inputClass}
                      value={option}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            service_options: prev.contact.service_options.map((entry, entryIndex) =>
                              entryIndex === index ? e.target.value : entry,
                            ),
                          },
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            service_options: prev.contact.service_options.filter(
                              (_, entryIndex) => entryIndex !== index,
                            ),
                          },
                        }))
                      }
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Map Section Heading</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Label</label>
              <input
                className={inputClass}
                value={form.map.label}
                onChange={(e) => setForm((prev) => ({ ...prev, map: { ...prev.map, label: e.target.value } }))}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={form.map.title}
                onChange={(e) => setForm((prev) => ({ ...prev, map: { ...prev.map, title: e.target.value } }))}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={form.map.subtitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, map: { ...prev.map, subtitle: e.target.value } }))
                }
              />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Offices</h2>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  offices: [
                    ...prev.offices,
                    { area: '', address: '', is_main: false, is_visible: true },
                  ],
                }))
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <Plus size={13} /> Add Office
            </button>
          </div>

          <div className="space-y-3">
            {form.offices.map((office, index) => (
              <div key={`${office.area}-${index}`} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Area</label>
                    <input
                      className={inputClass}
                      value={office.area}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          offices: prev.offices.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, area: e.target.value } : entry,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input
                      className={inputClass}
                      value={office.address}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          offices: prev.offices.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, address: e.target.value } : entry,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-5">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={office.is_visible}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            offices: prev.offices.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, is_visible: e.target.checked } : entry,
                            ),
                          }))
                        }
                      />
                      Visible
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="radio"
                        checked={office.is_main}
                        onChange={() =>
                          setForm((prev) => ({
                            ...prev,
                            offices: prev.offices.map((entry, entryIndex) => ({
                              ...entry,
                              is_main: entryIndex === index,
                            })),
                          }))
                        }
                      />
                      Main Office
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        offices: prev.offices.filter((_, entryIndex) => entryIndex !== index),
                      }))
                    }
                    className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                    title="Delete office"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {!form.offices.length ? (
              <div className="text-center text-sm text-gray-400 py-10 border border-dashed border-gray-200 rounded-xl">
                <MapPin size={18} className="mx-auto mb-2" />
                No offices yet. Add your first location.
              </div>
            ) : null}
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Business Hours</h2>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  business_hours: [...prev.business_hours, { day: '', hours: '' }],
                }))
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <Plus size={13} /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {form.business_hours.map((row, index) => (
              <div key={`${row.day}-${index}`} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  className={inputClass}
                  placeholder="Day range"
                  value={row.day}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      business_hours: prev.business_hours.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, day: e.target.value } : entry,
                      ),
                    }))
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Hours"
                  value={row.hours}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      business_hours: prev.business_hours.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, hours: e.target.value } : entry,
                      ),
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      business_hours: prev.business_hours.filter((_, entryIndex) => entryIndex !== index),
                    }))
                  }
                  className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast ? (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      ) : null}
    </AdminShell>
  )
}
