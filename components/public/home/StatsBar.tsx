import { STAT_ICON_MAP } from '@/lib/stat-icons'
import type { StatsBarConfig } from '@/types/page-config'

type Props = {
  config: StatsBarConfig
}

export default function StatsBar({ config }: Props) {
  if (!config.is_enabled) return null

  const visible = config.stats.filter((s) => s.is_visible)
  if (!visible.length) return null

  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {visible.map(({ id, icon, value, label }) => {
            const Icon = STAT_ICON_MAP[icon]
            return (
              <div
                key={id}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 py-8 px-6 border-gray-100/50 odd:border-r lg:border-r lg:last:border-r-0"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  {Icon ? <Icon size={22} className="text-white" /> : null}
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-black text-white leading-none">{value}</div>
                  <div className="text-white text-sm font-medium mt-0.5">{label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
