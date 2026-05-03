import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import SectionHeading from '@/components/public/shared/SectionHeading'
import GetAQuoteBanner from '@/components/public/home/GetAQuoteBanner'
import { getAboutPageConfig, getBanners } from '@/lib/data/fetchers'
import ConfigurableBanner from '@/components/public/shared/ConfigurableBanner'
import { getBannerForPlacement } from '@/lib/utils/banners'

export const metadata = {
  title: 'About Us',
  description:
    "Learn about Rukey's 12+ year history, our mission, values and the team behind Victoria's most trusted facility cleaning company.",
}

export default async function AboutPage() {
  const [config, banners] = await Promise.all([getAboutPageConfig(), getBanners()])
  const aboutBanner = getBannerForPlacement(banners, 'about_after_story')

  return (
    <>
      {config.sections.hero ? (
      <section className="relative bg-[var(--color-secondary)] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {config.hero.eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{config.hero.title}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            {config.hero.description}
          </p>
          <nav className="mt-6 flex justify-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-[var(--color-primary)]">About Us</span>
          </nav>
        </div>
      </section>
      ) : null}

      {config.sections.story ? (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[460px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={config.story.image_url}
                  alt="Rukey team"
                  fill
                  className="object-cover"
                />
              </div>
              {config.story.years_trusted ? (
                <div className="absolute -bottom-6 -right-6 bg-[var(--color-primary)] text-white rounded-2xl p-6 shadow-xl">
                  <div className="text-4xl font-black leading-none">{config.story.years_trusted}</div>
                  <div className="text-sm font-medium text-white mt-1">Years Trusted</div>
                </div>
              ) : null}
            </div>
            <div>
              <SectionHeading
                label={config.story.label}
                title={config.story.title}
                centered={false}
              />
              <p className="text-gray-500 leading-relaxed mb-5">
                {config.story.paragraph_1}
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                {config.story.paragraph_2}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {config.story.badges.map((label) => (
                  <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                    <CheckCircle2 size={18} className="text-[var(--color-primary)] shrink-0" />
                    <span className="text-sm font-semibold text-[var(--color-secondary)] line-clamp-2">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {config.sections.banner && aboutBanner ? (
        <section className="pb-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConfigurableBanner banner={aboutBanner} />
          </div>
        </section>
      ) : null}

      {config.sections.timeline ? (
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label={config.timeline.label} title={config.timeline.title} />
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-10">
              {config.timeline.items.map((m, i) => (
                <div key={m.year} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white rounded-xl p-5 shadow-sm inline-block max-w-xs">
                      <div className="text-[var(--color-primary)] font-black text-lg mb-1">{m.year}</div>
                      <p className="text-gray-600 text-sm">{m.event}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-[var(--color-primary)] rounded-full border-4 border-white shadow shrink-0" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {config.sections.team ? (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label={config.team.label} title={config.team.title} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {config.team.members.map((member) => (
              <div key={member.name} className="text-center group">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 group-hover:scale-105 transition-transform duration-200 shadow-md"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold text-[var(--color-secondary)] text-sm">{member.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {config.sections.get_quote ? <GetAQuoteBanner /> : null}
    </>
  )
}
