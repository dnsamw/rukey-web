import Image from 'next/image'
import { Clock, Leaf, Users, Headphones, ClipboardCheck, Star, Shield, CheckCircle, Award, Zap, Heart, Globe, Truck, Wrench, ThumbsUp, Sparkles, type LucideIcon } from 'lucide-react'
import type { WhyChooseUsConfig } from '@/types/page-config'

const ICON_MAP: Record<string, LucideIcon> = {
  Clock, Leaf, Users, Headphones, ClipboardCheck, Star,
  Shield, CheckCircle, Award, Zap, Heart, Globe, Truck, Wrench, ThumbsUp, Sparkles,
}

type Props = { config: WhyChooseUsConfig }

export default function WhyChooseUs({ config }: Props) {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — reasons grid */}
          <div>
            <span className="inline-block text-[var(--color-primary)] font-semibold text-sm uppercase tracking-widest mb-2">
              {config.eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4">
              {config.title}
            </h2>
            <div className="h-1 w-16 bg-[var(--color-primary)] rounded-full mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {config.reasons.map(({ icon, title, description }) => {
                const Icon = ICON_MAP[icon] ?? Star
                return (
                  <div key={title} className="flex gap-4">
                    <div className="w-11 h-11 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-secondary)] text-sm mb-1">{title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — image with overlay card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden h-[520px] shadow-xl">
              <Image
                src={config.image_url}
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
                &ldquo;{config.testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {config.testimonial.author_initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--color-secondary)]">{config.testimonial.author_name}</div>
                  <div className="text-[10px] text-gray-400">{config.testimonial.author_role}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
