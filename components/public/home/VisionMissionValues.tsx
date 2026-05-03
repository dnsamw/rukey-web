import { Eye, Target, Heart } from 'lucide-react'

const items = [
  {
    icon: Eye,
    title: 'Our Vision',
    color: 'bg-blue-50',
    iconBg: 'bg-[var(--color-secondary)]',
    description:
      'To be Australia\'s most trusted and recognised facility services provider — known for excellence, innovation, and our unwavering commitment to cleaner, healthier environments.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    color: 'bg-orange-50',
    iconBg: 'bg-[var(--color-primary)]',
    description:
      'To deliver consistently outstanding cleaning solutions through well-trained staff, eco-friendly products, and personalised service programs that exceed our clients\' expectations every time.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    color: 'bg-green-50',
    iconBg: 'bg-emerald-500',
    description:
      'Integrity, reliability, and care are at the heart of everything we do. We treat every facility as our own — with respect for people, property, and the environment.',
  },
]

export default function VisionMissionValues() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">
            Who We Are
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">
            Driven by Purpose, Guided by Values
          </h2>
          <div className="mt-4 h-1 w-16 bg-[var(--color-primary)] rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map(({ icon: Icon, title, color, iconBg, description }) => (
            <div
              key={title}
              className={`${color} rounded-2xl p-8 flex flex-col items-start group hover:shadow-lg transition-shadow duration-300`}
            >
              {/* Icon */}
              <div className={`${iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={26} className="text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-4">{title}</h3>

              {/* Divider */}
              <div className="w-10 h-1 bg-[var(--color-primary)] rounded-full mb-4" />

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
