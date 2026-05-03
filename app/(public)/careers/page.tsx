import Link from 'next/link'
import { MapPin, Clock, ArrowRight, Heart } from 'lucide-react'
import SectionHeading from '@/components/public/shared/SectionHeading'
import GetAQuoteBanner from '@/components/public/home/GetAQuoteBanner'
import {
  getBanners,
  getCareersPageConfig,
  getJobPostings,
} from '@/lib/data/fetchers'
import ConfigurableBanner from '@/components/public/shared/ConfigurableBanner'
import { getBannerForPlacement } from '@/lib/utils/banners'

export const metadata = {
  title: 'Careers',
  description:
    'Join the Rukey team. Browse current job openings across Victoria and build a rewarding career with one of Australia\'s most respected cleaning companies.',
}

export default async function CareersPage() {
  const [config, banners, jobs] = await Promise.all([
    getCareersPageConfig(),
    getBanners(),
    getJobPostings(true),
  ])
  const careersBanner = getBannerForPlacement(banners, 'careers_after_roles')

  return (
    <>
      {config.sections.hero ? (
      <section className="bg-[var(--color-secondary)] py-24 relative overflow-hidden">
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
            <span className="text-[var(--color-primary)]">Careers</span>
          </nav>
        </div>
      </section>
      ) : null}

      {config.sections.perks ? (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label={config.perks.label} title={config.perks.title} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {config.perks.items.map((p) => (
              <div key={p.label} className="bg-gray-50 rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{p.icon}</div>
                <div className="text-sm font-semibold text-[var(--color-secondary)]">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {config.sections.jobs ? (
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label={config.jobs.label} title={config.jobs.title} />
          {config.jobs.show_open_roles && jobs.length ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock size={11} /> {job.employment_type || 'Role'}
                    </span>
                  </div>
                  <h3 className="font-bold text-[var(--color-secondary)] text-base group-hover:text-[var(--color-primary)] transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-gray-400 text-sm">
                    <MapPin size={13} />
                    {job.location}
                  </div>
                </div>
                <Link
                  href={`mailto:${config.fallback.email}?subject=${encodeURIComponent(`Application - ${job.title}`)}`}
                  className="inline-flex items-center gap-2 bg-[var(--color-secondary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--color-primary)] transition-colors shrink-0"
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          ) : null}

          {config.sections.fallback ? (
          <div className="mt-10 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-2xl p-8 text-center">
            <Heart size={28} className="text-[var(--color-primary)] mx-auto mb-3" />
            <h3 className="font-bold text-[var(--color-secondary)] mb-2">{config.fallback.title}</h3>
            <p className="text-gray-500 text-sm mb-5">
              {config.fallback.message}
            </p>

            <a  href={`mailto:${config.fallback.email}`}
              className="inline-block bg-[var(--color-primary)] text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              {config.fallback.button_label}
            </a>
          </div>
          ) : null}
        </div>
      </section>
      ) : null}

      {config.sections.banner && careersBanner ? (
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConfigurableBanner banner={careersBanner} />
          </div>
        </section>
      ) : null}

      {config.sections.get_quote ? <GetAQuoteBanner /> : null}
    </>
  )
}