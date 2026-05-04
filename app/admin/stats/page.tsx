'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/layout/AdminShell'
import PageHeader from '@/components/admin/ui/PageHeader'
import Toast from '@/components/admin/ui/Toast'
import { Plus, Trash2, Eye, EyeOff, GripVertical, Save } from 'lucide-react'
import { defaultStatsBarConfig, type StatItem, type StatsBarConfig } from '@/types/page-config'
import { STAT_ICON_MAP, STAT_ICON_OPTIONS } from '@/lib/stat-icons'

const inputClass =
  'w-24 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all'

function StatsPreview({ config }: { config: StatsBarConfig }) {
  if (!config.is_enabled) {
    return (
      <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
        Stats bar is currently disabled — enable it to show it on the site.
      </div>
    )
  }

  const visible = config.stats.filter((s) => s.is_visible)

  if (!visible.length) {
    return (
      <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
        No visible stats — enable at least one stat to display the bar.
      </div>
    )
  }

  const cols =
    visible.length === 1
      ? 'grid-cols-1'
      : visible.length === 2
        ? 'grid-cols-2'
        : visible.length === 3
          ? 'grid-cols-3'
          : 'grid-cols-4'

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className={`grid ${cols} divide-x divide-white/20`}>
        {visible.map((stat) => {
          const Icon = STAT_ICON_MAP[stat.icon]
          return (
            <div
              key={stat.id}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 px-4"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                {Icon ? <Icon size={18} className="text-white" /> : null}
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl font-black text-white leading-none">
                  {stat.value || '—'}
                </div>
                <div className="text-white text-xs font-medium mt-0.5">
                  {stat.label || 'Label'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StatsAdminPage() {
  const supabase = createClient()
  const [config, setConfig] = useState<StatsBarConfig>(defaultStatsBarConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'stats_bar')
        .maybeSingle()

      if (data?.value) {
        const value = data.value as Partial<StatsBarConfig>
        setConfig({
          is_enabled: value.is_enabled ?? defaultStatsBarConfig.is_enabled,
          stats: value.stats ?? defaultStatsBarConfig.stats,
        })
      }
      setLoading(false)
    }
    fetchConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      ...config,
      stats: config.stats.filter((s) => s.label.trim() || s.value.trim()),
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update({ value: payload, updated_at: new Date().toISOString() })
      .eq('key', 'stats_bar')
      .select('id')

    if (error || !data?.length) {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert({ key: 'stats_bar', value: payload })
      if (insertError) {
        setToast({ message: 'Failed to save stats bar settings.', type: 'error' })
        setSaving(false)
        return
      }
    }

    await fetch('/api/revalidate', { method: 'POST' })
    setToast({ message: 'Stats bar settings saved!', type: 'success' })
    setSaving(false)
  }

  const addStat = () => {
    const id = `stat_${Date.now()}`
    setConfig((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        { id, icon: 'Star', value: '', label: '', is_visible: true },
      ],
    }))
  }

  const removeStat = (id: string) => {
    setConfig((prev) => ({ ...prev, stats: prev.stats.filter((s) => s.id !== id) }))
  }

  const updateStat = <K extends keyof StatItem>(id: string, field: K, value: StatItem[K]) => {
    setConfig((prev) => ({
      ...prev,
      stats: prev.stats.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }))
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
        <PageHeader
          title="Stats Bar"
          subtitle="The row of key statistics shown below the hero slider."
          action={
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          }
        />

        {/* General */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[var(--color-secondary)]">Enable Stats Bar</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                When disabled, the stats bar is completely hidden from the homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfig((p) => ({ ...p, is_enabled: !p.is_enabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                config.is_enabled ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  config.is_enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stat items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[var(--color-secondary)]">Statistics</h2>
            <button
              onClick={addStat}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)]"
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {config.stats.map((stat) => {
              const Icon = STAT_ICON_MAP[stat.icon]
              return (
                <div
                  key={stat.id}
                  className={`border rounded-xl p-3 transition-all ${
                    stat.is_visible
                      ? 'border-gray-200 bg-white'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Row 1: drag handle + icon preview + icon select + action buttons */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="text-gray-300 cursor-grab shrink-0">
                      <GripVertical size={16} />
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-primary)]/10 shrink-0">
                      {Icon ? <Icon size={16} className="text-[var(--color-primary)]" /> : null}
                    </div>
                    <select
                      value={stat.icon}
                      onChange={(e) => updateStat(stat.id, 'icon', e.target.value)}
                      className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 bg-white"
                    >
                      {STAT_ICON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateStat(stat.id, 'is_visible', !stat.is_visible)}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                        title={stat.is_visible ? 'Hide this stat' : 'Show this stat'}
                      >
                        {stat.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => removeStat(stat.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100"
                        title="Remove stat"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: value + label inputs, indented to align with select */}
                  <div className="flex gap-2 pl-10">
                    <input
                      value={stat.value}
                      onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                      placeholder="500+"
                      className={`${inputClass} w-24 shrink-0`}
                    />
                    <input
                      value={stat.label}
                      onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                      placeholder="Happy Clients"
                      className={`${inputClass} flex-1 min-w-0`}
                    />
                  </div>
                </div>
              )
            })}

            {!config.stats.length && (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
                No stats yet.{' '}
                <button onClick={addStat} className="text-[var(--color-primary)] font-semibold hover:underline">
                  Add one
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[var(--color-secondary)] mb-4">Live Preview</h2>
          <StatsPreview config={config} />
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </AdminShell>
  )
}
