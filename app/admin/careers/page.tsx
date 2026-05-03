'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Save,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import Toast from '@/components/admin/ui/Toast'
import {
  defaultCareersPageConfig,
  type CareersPageConfig,
} from '@/types/page-config'

type JobPosting = {
  id: string
  title: string
  description: string
  location: string
  employment_type: string | null
  salary_min: number | null
  salary_max: number | null
  is_active: boolean
}

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  perks: 'Perks Section',
  jobs: 'Jobs Section',
  fallback: 'Fallback Message Box',
  banner: 'Configurable Banner',
  get_quote: 'Get a Quote CTA',
}

const emptyJobForm = {
  title: '',
  description: '',
  location: '',
  employment_type: 'Full-time',
  salary_min: '',
  salary_max: '',
}

export default function CareersAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [savingConfig, setSavingConfig] = useState(false)
  const [config, setConfig] = useState<CareersPageConfig>(defaultCareersPageConfig)

  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [jobForm, setJobForm] = useState(emptyJobForm)
  const [savingJob, setSavingJob] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<JobPosting | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const fetchJobs = useCallback(async () => {
    const { data } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false })
    setJobs(data ?? [])
  }, [supabase])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: configData }] = await Promise.all([
          supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'careers_page')
            .maybeSingle(),
          fetchJobs(),
        ])

        if (configData?.value) {
          const value = configData.value as Partial<CareersPageConfig>
          setConfig({
            ...defaultCareersPageConfig,
            ...value,
            sections: {
              ...defaultCareersPageConfig.sections,
              ...(value.sections ?? {}),
            },
            hero: { ...defaultCareersPageConfig.hero, ...(value.hero ?? {}) },
            perks: {
              ...defaultCareersPageConfig.perks,
              ...(value.perks ?? {}),
              items: value.perks?.items ?? defaultCareersPageConfig.perks.items,
            },
            jobs: { ...defaultCareersPageConfig.jobs, ...(value.jobs ?? {}) },
            fallback: {
              ...defaultCareersPageConfig.fallback,
              ...(value.fallback ?? {}),
            },
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchJobs, supabase])

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

  const handleSaveConfig = async () => {
    setSavingConfig(true)
    const payload: CareersPageConfig = {
      ...config,
      perks: {
        ...config.perks,
        items: config.perks.items.filter((item) => item.label.trim()),
      },
    }
    const response = await saveSetting('careers_page', payload)

    if (!response.error) {
      await fetch('/api/revalidate', { method: 'POST' })
      setToast({ message: 'Careers page settings saved!', type: 'success' })
    } else {
      setToast({ message: 'Failed to save careers page settings.', type: 'error' })
    }
    setSavingConfig(false)
  }

  const openAdd = () => {
    setEditingJob(null)
    setJobForm(emptyJobForm)
    setModalOpen(true)
  }

  const openEdit = (job: JobPosting) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      employment_type: job.employment_type ?? '',
      salary_min: job.salary_min?.toString() ?? '',
      salary_max: job.salary_max?.toString() ?? '',
    })
    setModalOpen(true)
  }

  const handleSaveJob = async () => {
    if (!jobForm.title || !jobForm.description || !jobForm.location) {
      setToast({ message: 'Title, description and location are required.', type: 'error' })
      return
    }

    setSavingJob(true)
    const payload = {
      title: jobForm.title,
      description: jobForm.description,
      location: jobForm.location,
      employment_type: jobForm.employment_type || null,
      salary_min: jobForm.salary_min ? Number(jobForm.salary_min) : null,
      salary_max: jobForm.salary_max ? Number(jobForm.salary_max) : null,
    }

    if (editingJob) {
      const { error } = await supabase
        .from('job_postings')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editingJob.id)
      if (error) {
        setToast({ message: 'Failed to update job.', type: 'error' })
        setSavingJob(false)
        return
      }
      setToast({ message: 'Job updated successfully!', type: 'success' })
    } else {
      const { error } = await supabase
        .from('job_postings')
        .insert({ ...payload, is_active: true })
      if (error) {
        setToast({ message: 'Failed to create job.', type: 'error' })
        setSavingJob(false)
        return
      }
      setToast({ message: 'Job created successfully!', type: 'success' })
    }

    setSavingJob(false)
    setModalOpen(false)
    await fetchJobs()
    await fetch('/api/revalidate', { method: 'POST' })
  }

  const handleToggleActive = async (job: JobPosting) => {
    const { error } = await supabase
      .from('job_postings')
      .update({ is_active: !job.is_active, updated_at: new Date().toISOString() })
      .eq('id', job.id)

    if (error) {
      setToast({ message: 'Failed to update job visibility.', type: 'error' })
      return
    }

    await fetchJobs()
    await fetch('/api/revalidate', { method: 'POST' })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('job_postings').delete().eq('id', deleteTarget.id)
    if (error) {
      setToast({ message: 'Failed to delete job.', type: 'error' })
    } else {
      setToast({ message: 'Job deleted.', type: 'success' })
      await fetch('/api/revalidate', { method: 'POST' })
    }
    setDeleting(false)
    setDeleteTarget(null)
    await fetchJobs()
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
          title="Careers Page"
          subtitle="Control careers page sections and manage job listings."
          action={
            <button
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md disabled:opacity-60"
            >
              <Save size={15} />
              {savingConfig ? 'Saving...' : 'Save Page Settings'}
            </button>
          }
        />

        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Section Visibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(config.sections).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setConfig((prev) => ({
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
                value={config.hero.eyebrow}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, hero: { ...prev.hero, eyebrow: e.target.value } }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={config.hero.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={config.hero.description}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, description: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Perks</h2>
            <button
              type="button"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  perks: {
                    ...prev.perks,
                    items: [...prev.perks.items, { icon: '✨', label: '' }],
                  },
                }))
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <Plus size={13} /> Add Perk
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Section Label</label>
              <input
                className={inputClass}
                value={config.perks.label}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, perks: { ...prev.perks, label: e.target.value } }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input
                className={inputClass}
                value={config.perks.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, perks: { ...prev.perks, title: e.target.value } }))
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            {config.perks.items.map((perk, index) => (
              <div key={`${perk.label}-${index}`} className="grid grid-cols-[80px_1fr_auto] gap-2 items-center">
                <input
                  className={inputClass}
                  value={perk.icon}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      perks: {
                        ...prev.perks,
                        items: prev.perks.items.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, icon: e.target.value } : entry,
                        ),
                      },
                    }))
                  }
                />
                <input
                  className={inputClass}
                  value={perk.label}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      perks: {
                        ...prev.perks,
                        items: prev.perks.items.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, label: e.target.value } : entry,
                        ),
                      },
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      perks: {
                        ...prev.perks,
                        items: prev.perks.items.filter((_, entryIndex) => entryIndex !== index),
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
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Jobs Section Copy</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Section Label</label>
                <input
                  className={inputClass}
                  value={config.jobs.label}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, jobs: { ...prev.jobs, label: e.target.value } }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Section Title</label>
                <input
                  className={inputClass}
                  value={config.jobs.title}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, jobs: { ...prev.jobs, title: e.target.value } }))
                  }
                />
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={config.jobs.show_open_roles}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    jobs: { ...prev.jobs, show_open_roles: e.target.checked },
                  }))
                }
              />
              Show open roles list
            </label>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="font-bold text-[var(--color-secondary)] mb-5">Fallback Message</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={config.fallback.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, fallback: { ...prev.fallback, title: e.target.value } }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Message</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={config.fallback.message}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    fallback: { ...prev.fallback, message: e.target.value },
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Button Label</label>
                <input
                  className={inputClass}
                  value={config.fallback.button_label}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      fallback: { ...prev.fallback, button_label: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  className={inputClass}
                  type="email"
                  value={config.fallback.email}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      fallback: { ...prev.fallback, email: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Job Listings</h2>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)]"
            >
              <Plus size={14} /> Add Job
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`border rounded-xl p-4 flex items-start justify-between gap-3 ${
                  job.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-70'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-[var(--color-secondary)]">{job.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        job.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {job.is_active ? 'Visible' : 'Hidden'}
                    </span>
                    {job.employment_type ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {job.employment_type}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-500">{job.location}</p>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{job.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(job)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    title={job.is_active ? 'Hide' : 'Show'}
                  >
                    {job.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => openEdit(job)}
                    className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(job)}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            {!jobs.length ? (
              <div className="text-center text-sm text-gray-400 py-10 border border-dashed border-gray-200 rounded-xl">
                <Briefcase size={18} className="mx-auto mb-2" />
                No job listings yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Job Listing' : 'Add Job Listing'}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Job Title</label>
            <input
              className={inputClass}
              value={jobForm.title}
              onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={jobForm.description}
              onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                value={jobForm.location}
                onChange={(e) => setJobForm((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Employment Type</label>
              <input
                className={inputClass}
                value={jobForm.employment_type}
                onChange={(e) =>
                  setJobForm((prev) => ({ ...prev, employment_type: e.target.value }))
                }
                placeholder="Full-time / Part-time"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Salary Min (optional)</label>
              <input
                className={inputClass}
                value={jobForm.salary_min}
                onChange={(e) => setJobForm((prev) => ({ ...prev, salary_min: e.target.value }))}
                type="number"
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>Salary Max (optional)</label>
              <input
                className={inputClass}
                value={jobForm.salary_max}
                onChange={(e) => setJobForm((prev) => ({ ...prev, salary_max: e.target.value }))}
                type="number"
                min="0"
              />
            </div>
          </div>
          <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl p-3 text-xs text-gray-600 flex items-start gap-2">
            <Sparkles size={14} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
            Applications use the fallback email configured above.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveJob}
              disabled={savingJob}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
            >
              {savingJob ? 'Saving...' : editingJob ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Job Listing"
        message={`Delete the job "${deleteTarget?.title}"? This cannot be undone.`}
      />

      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </AdminShell>
  )
}
