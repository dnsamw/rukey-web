import Image from 'next/image'
import CTAButton from '@/components/public/shared/CTAButton'
import SectionHeading from '@/components/public/shared/SectionHeading'
import { CheckCircle2 } from 'lucide-react'
import { defaultAboutPageConfig, type AboutPageConfig } from '@/types/page-config'

type Props = {
  story?: AboutPageConfig['story']
}

export default function AboutSection({ story = defaultAboutPageConfig.story }: Props) {
  const quickBadges = story.badges.slice(0, 3)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Image stack */}
          <div className="relative">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden h-[480px] shadow-xl">
              <Image
                src={story.image_url}
                alt="Professional cleaning team"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)]/40 to-transparent" />
            </div>

            {/* Floating badge — years experience */}
            {story.years_trusted ? (
            <div className="absolute bottom-4 right-4 lg:-bottom-6 lg:-right-6 bg-primary text-white rounded-2xl p-4 lg:p-6 shadow-xl">
              <div className="text-3xl lg:text-4xl font-black leading-none">{story.years_trusted}</div>
              <div className="text-xs lg:text-sm font-medium text-white mt-1">Years of<br />Experience</div>
            </div>
            ) : null}

            {/* Floating badge — clients */}
            {story.client_count ? (
            <div className="absolute top-4 left-4 lg:-top-6 lg:-left-6 bg-white rounded-2xl p-3 lg:p-4 shadow-xl border border-gray-100">
              <div className="text-xl lg:text-2xl font-black text-secondary leading-none">{story.client_count}</div>
              <div className="text-xs font-medium text-gray-400 mt-1">Happy Clients</div>
            </div>
            ) : null}

            {/* Trust badges row — hidden on mobile to avoid overlapping the years badge */}
            <div className="hidden lg:flex absolute bottom-6 left-6 gap-3">
              {quickBadges.map((badge) => (
                <div
                  key={badge}
                  className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-md"
                >
                  <div className="w-7 h-7 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-secondary)] leading-none max-w-28 truncate">{badge}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <SectionHeading
              label={story.label}
              title={story.title}
              subtitle={story.paragraph_1}
              centered={false}
            />

            <p className="text-gray-500 leading-relaxed mb-8">
              {story.paragraph_2}
            </p>

            {/* Highlights list */}
            <ul className="space-y-3 mb-10">
              {story.badges.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-[var(--color-primary)] shrink-0 mt-0.5"
                  />
                  <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <CTAButton href="/about">Learn More About Us</CTAButton>
              <CTAButton href="/contact" variant="outline">Get In Touch</CTAButton>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}