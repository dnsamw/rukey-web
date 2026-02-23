'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import Toast from '@/components/admin/ui/Toast'
import ImageUploader from '@/components/admin/editors/ImageUploader'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

type Service = {
  id: string
  name: string
  slug: string
  short_description: string
  full_description: string
  benefits: string[]
  includes: string[]
  image_url: string
  icon_name: string
  order: number
  is_active: boolean
}

const iconOptions = [
  'Building2', 'GraduationCap', 'Heart', 'Dumbbell',
  'Landmark', 'ShoppingBag', 'Factory', 'Wind',
]

const emptyForm = {
  name: '', slug: '', short_description: '', full_description: '',
  benefits: [''], includes: [''], image_url: '', icon_name: 'Building2',
}

export default function ServicesEditorPage() {
  const supabase = createClient()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    setToast({ message, type })

  const fetchServices = useCallback(async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true })
    setServices(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openAdd = () => {
    setEditingService(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditingService(service)
    setForm({
      name: service.name,
      slug: service.slug,
      short_description: service.short_description,
      full_description: service.full_description,
      benefits: service.benefits.length ? service.benefits : [''],
      includes: service.includes.length ? service.includes : [''],
      image_url: service.image_url,
      icon_name: service.icon_name,
    })
    setModalOpen(true)
  }

  const updateListItem = (field: 'benefits' | 'includes', index: number, value: string) => {
    setForm((p) => {
      const arr = [...p[field]]
      arr[index] = value
      return { ...p, [field]: arr }
    })
  }

  const addListItem = (field: 'benefits' | 'includes') =>
    setForm((p) => ({ ...p, [field]: [...p[field], ''] }))

  const removeListItem = (field: 'benefits' | 'includes', index: number) =>
    setForm((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }))

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.short_description || !form.image_url) {
      showToast('Please fill in all required fields.', 'error')
      return
    }
    setSaving(true)

    const payload = {
      ...form,
      benefits: form.benefits.filter(Boolean),
      includes: form.includes.filter(Boolean),
    }

    if (editingService) {
      const { error } = await supabase.from('services').update(payload).eq('id', editingService.id)
      if (error) { showToast('Failed to update service.', 'error'); setSaving(false); return }
      showToast('Service updated successfully!')
    } else {
      const maxOrder = services.length ? Math.max(...services.map((s) => s.order)) : 0
      const { error } = await supabase.from('services').insert({ ...payload, order: maxOrder + 1, is_active: true })
      if (error) { showToast('Failed to create service.', 'error'); setSaving(false); return }
      showToast('Service created successfully!')
    }

    setSaving(false)
    setModalOpen(false)
    fetchServices()
  }

  const handleToggleActive = async (service: Service) => {
    await supabase.from('services').update({ is_active: !service.is_active }).eq('id', service.id)
    fetchServices()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('services').delete().eq('id', deleteTarget.id)
    if (error) { showToast('Failed to delete service.', 'error') }
    else { showToast('Service deleted.') }
    setDeleting(false)
    setDeleteTarget(null)
    fetchServices()
  }

  const inputClass = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
  const labelClass = "block text-xs font-semibold text-[var(--color-secondary)] mb-1.5"

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Services"
          subtitle="Manage the cleaning services displayed on your website."
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md"
            >
              <Plus size={16} /> Add Service
            </button>
          }
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border shadow-sm flex overflow-hidden ${
                  !service.is_active ? 'opacity-60' : 'border-gray-100'
                }`}
              >
                <div className="relative w-32 h-24 shrink-0">
                  <Image src={service.image_url} alt={service.name} fill className="object-cover" />
                </div>
                <div className="flex-1 px-5 py-4 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[var(--color-secondary)]">{service.name}</span>
                        <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded-md">
                          /{service.slug}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          service.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {service.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm truncate max-w-md">{service.short_description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                      >
                        {service.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => openEdit(service)}
                        className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(service)}
                        className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!services.length && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm mb-4">No services yet. Add your first service.</p>
                <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
                  <Plus size={16} /> Add Service
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <div className="space-y-5">
          {/* Name + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Service Name <span className="text-[var(--color-primary)]">*</span></label>
              <input
                className={inputClass}
                placeholder="e.g. Office Cleaning"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))}
              />
            </div>
            <div>
              <label className={labelClass}>URL Slug <span className="text-[var(--color-primary)]">*</span></label>
              <input
                className={inputClass}
                placeholder="e.g. office-cleaning"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
              />
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className={labelClass}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, icon_name: icon }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.icon_name === icon
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-gray-200 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Short description */}
          <div>
            <label className={labelClass}>Short Description <span className="text-[var(--color-primary)]">*</span></label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={2}
              placeholder="Brief summary shown on service cards..."
              value={form.short_description}
              onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))}
            />
          </div>

          {/* Full description */}
          <div>
            <label className={labelClass}>Full Description</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={4}
              placeholder="Detailed description shown on the service detail page..."
              value={form.full_description}
              onChange={(e) => setForm((p) => ({ ...p, full_description: e.target.value }))}
            />
          </div>

          {/* Benefits + Includes side by side */}
          <div className="grid grid-cols-2 gap-6">
            {(['benefits', 'includes'] as const).map((field) => (
              <div key={field}>
                <label className={labelClass}>
                  {field === 'benefits' ? 'Key Benefits' : "What's Included"}
                </label>
                <div className="space-y-2">
                  {form[field].map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder={`Item ${i + 1}`}
                        value={item}
                        onChange={(e) => updateListItem(field, i, e.target.value)}
                      />
                      {form[field].length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeListItem(field, i)}
                          className="text-red-400 hover:text-red-600 shrink-0"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addListItem(field)}
                    className="text-xs text-[var(--color-primary)] font-semibold hover:underline"
                  >
                    + Add item
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          <ImageUploader
            label="Service Image *"
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
              {saving ? 'Saving...' : editingService ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminShell>
  )
}
