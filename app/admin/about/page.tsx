'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import ImageUploader from '@/components/admin/editors/ImageUploader'
import Toast from '@/components/admin/ui/Toast'
import {
  defaultAboutPageConfig,
  type AboutPageConfig,
} from '@/types/page-config'

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  story: 'Story Section',
  timeline: 'Journey Timeline',
  team: 'Team Section',
  banner: 'Configurable Banner',
  get_quote: 'Get a Quote CTA',
}

export default function AboutAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<AboutPageConfig>(defaultAboutPageConfig)
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
          .eq('key', 'about_page')
          .maybeSingle()

        if (data?.value) {
          const value = data.value as Partial<AboutPageConfig>
          setForm({
            ...defaultAboutPageConfig,
            ...value,
            sections: {
              ...defaultAboutPageConfig.sections,
              ...(value.sections ?? {}),
            },
            hero: { ...defaultAboutPageConfig.hero, ...(value.hero ?? {}) },
            story: {
              ...defaultAboutPageConfig.story,
              ...(value.story ?? {}),
              badges: value.story?.badges ?? defaultAboutPageConfig.story.badges,
            },
            timeline: {
              ...defaultAboutPageConfig.timeline,
              ...(value.timeline ?? {}),
              items: value.timeline?.items ?? defaultAboutPageConfig.timeline.items,
            },
            team: {
              ...defaultAboutPageConfig.team,
              ...(value.team ?? {}),
              members: value.team?.members ?? defaultAboutPageConfig.team.members,
            },
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
    const payload: AboutPageConfig = {
      ...form,
      story: {
        ...form.story,
        badges: form.story.badges.map((item) => item.trim()).filter(Boolean),
      },
      timeline: {
        ...form.timeline,
        items: form.timeline.items.filter((item) => item.year.trim() || item.event.trim()),
      },
      team: {
        ...form.team,
        members: form.team.members.filter((member) => member.name.trim()),
      },
    }

    const response = await saveSetting('about_page', payload)

    if (!response.error) {
      await fetch('/api/revalidate', { method: 'POST' })
      setToast({ message: 'About page settings saved!', type: 'success' })
    } else {
      setToast({ message: 'Failed to save About page settings.', type: 'error' })
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
          title="About Page"
          subtitle="Configure every section of the About page and control visibility."
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
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Hero</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                className={inputClass}
                value={form.hero.eyebrow}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, eyebrow: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={form.hero.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={form.hero.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, description: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Section Label</label>
              <input
                className={inputClass}
                value={form.story.label}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    story: { ...prev.story, label: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input
                className={inputClass}
                value={form.story.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    story: { ...prev.story, title: e.target.value },
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Story Paragraph 1</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={form.story.paragraph_1}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    story: { ...prev.story, paragraph_1: e.target.value },
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Story Paragraph 2</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={form.story.paragraph_2}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    story: { ...prev.story, paragraph_2: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Years Trusted Badge</label>
              <input
                className={inputClass}
                value={form.story.years_trusted}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    story: { ...prev.story, years_trusted: e.target.value },
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploader
                label="Story Image"
                value={form.story.image_url}
                onChange={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    story: { ...prev.story, image_url: url },
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[var(--color-secondary)] text-sm">Badges</h3>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    story: { ...prev.story, badges: [...prev.story.badges, ''] },
                  }))
                }
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
              >
                <Plus size={13} /> Add Badge
              </button>
            </div>
            <div className="space-y-2">
              {form.story.badges.map((badge, index) => (
                <div key={`${badge}-${index}`} className="flex gap-2">
                  <input
                    className={inputClass}
                    value={badge}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        story: {
                          ...prev.story,
                          badges: prev.story.badges.map((item, itemIndex) =>
                            itemIndex === index ? e.target.value : item,
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
                        story: {
                          ...prev.story,
                          badges: prev.story.badges.filter((_, itemIndex) => itemIndex !== index),
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

        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Timeline</h2>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  timeline: {
                    ...prev.timeline,
                    items: [...prev.timeline.items, { year: '', event: '' }],
                  },
                }))
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <Plus size={13} /> Add Milestone
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Section Label</label>
              <input
                className={inputClass}
                value={form.timeline.label}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    timeline: { ...prev.timeline, label: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input
                className={inputClass}
                value={form.timeline.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    timeline: { ...prev.timeline, title: e.target.value },
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            {form.timeline.items.map((item, index) => (
              <div key={`${item.year}-${index}`} className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto] gap-2">
                <input
                  className={inputClass}
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      timeline: {
                        ...prev.timeline,
                        items: prev.timeline.items.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, year: e.target.value } : entry,
                        ),
                      },
                    }))
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Milestone"
                  value={item.event}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      timeline: {
                        ...prev.timeline,
                        items: prev.timeline.items.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, event: e.target.value } : entry,
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
                      timeline: {
                        ...prev.timeline,
                        items: prev.timeline.items.filter((_, entryIndex) => entryIndex !== index),
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

        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Team Members</h2>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  team: {
                    ...prev.team,
                    members: [
                      ...prev.team.members,
                      { name: '', role: '', initials: '', color: '#1E3A5F' },
                    ],
                  },
                }))
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <Plus size={13} /> Add Member
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Section Label</label>
              <input
                className={inputClass}
                value={form.team.label}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    team: { ...prev.team, label: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input
                className={inputClass}
                value={form.team.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    team: { ...prev.team, title: e.target.value },
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            {form.team.members.map((member, index) => (
              <div key={`${member.name}-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                <div className="md:col-span-2">
                  <label className={labelClass}>Name</label>
                  <input
                    className={inputClass}
                    value={member.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        team: {
                          ...prev.team,
                          members: prev.team.members.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, name: e.target.value } : entry,
                          ),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input
                    className={inputClass}
                    value={member.role}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        team: {
                          ...prev.team,
                          members: prev.team.members.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, role: e.target.value } : entry,
                          ),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Initials</label>
                  <input
                    className={inputClass}
                    maxLength={3}
                    value={member.initials}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        team: {
                          ...prev.team,
                          members: prev.team.members.map((entry, entryIndex) =>
                            entryIndex === index
                              ? { ...entry, initials: e.target.value.toUpperCase() }
                              : entry,
                          ),
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={member.color}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        team: {
                          ...prev.team,
                          members: prev.team.members.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, color: e.target.value } : entry,
                          ),
                        },
                      }))
                    }
                    className="w-12 h-10 rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        team: {
                          ...prev.team,
                          members: prev.team.members.filter((_, entryIndex) => entryIndex !== index),
                        },
                      }))
                    }
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
