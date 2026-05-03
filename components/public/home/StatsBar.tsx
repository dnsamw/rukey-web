import { Users, Building2, ThumbsUp, Clock } from 'lucide-react'

const stats = [
  { icon: Users, value: '500+', label: 'Happy Clients' },
  { icon: Building2, value: '12+', label: 'Years Experience' },
  { icon: ThumbsUp, value: '98%', label: 'Satisfaction Rate' },
  { icon: Clock, value: '24/7', label: 'Available Service' },
]

export default function StatsBar() {
  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100/50">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 py-8 px-6"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={22} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-black text-white leading-none">{value}</div>
                <div className="text-white text-sm font-medium mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}