import Image from 'next/image'
import { Clock, Leaf, Users, Headphones, ClipboardCheck, Star } from 'lucide-react'

const reasons = [
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'We work around your hours — early mornings, evenings, weekends and public holidays.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Products',
    description: 'We use environmentally responsible, non-toxic cleaning products safe for people and the planet.',
  },
  {
    icon: Users,
    title: 'Trained & Vetted Staff',
    description: 'All our cleaners are police-checked, fully trained, and covered by comprehensive insurance.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'A dedicated account manager for every client — reachable whenever you need us.',
  },
  {
    icon: ClipboardCheck,
    title: 'Quality Audits',
    description: 'Regular on-site quality checks ensure our standards never slip, every single visit.',
  },
  {
    icon: Star,
    title: 'Tailored Programs',
    description: 'No cookie-cutter contracts — every cleaning program is built around your specific needs.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — reasons grid */}
          <div>
            <span className="inline-block text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">
              Why Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4">
              The Rukey Difference
            </h2>
            <div className="h-1 w-16 bg-[var(--color-primary)] rounded-full mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reasons.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-11 h-11 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-secondary)] text-sm mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image with overlay card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden h-[520px] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=900&q=80"
                alt="Professional cleaner at work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)]/60 to-transparent" />
            </div>

            {/* Floating review card */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
                ))}
                <span className="text-xs text-gray-400 ml-1">5.0</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic mb-3">
                "Rukey transformed our office — the team is reliable, thorough and an absolute pleasure to work with."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  SJ
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--color-secondary)]">Sarah J.</div>
                  <div className="text-[10px] text-gray-400">Operations Manager, Melbourne</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}