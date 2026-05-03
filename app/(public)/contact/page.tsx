import Link from 'next/link'
import ContactSection from '@/components/public/home/ContactSection'
import { getSiteSettings, getBanners, getContactPageConfig } from '@/lib/data/fetchers'
import MapSection from '@/components/public/shared/MapSection';
import ConfigurableBanner from '@/components/public/shared/ConfigurableBanner'
import { getBannerForPlacement } from '@/lib/utils/banners'

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Rukey Facility Services. Call 1300 565 576, email us, or fill in our contact form and we\'ll respond within one business day.',
}

export default async function ContactPage() {
  const [settings, banners, pageConfig] = await Promise.all([
    getSiteSettings(),
    getBanners(),
    getContactPageConfig(),
  ])
  const contactBanner = getBannerForPlacement(banners, 'contact_after_form')
  return (
    <>
      {pageConfig.sections.hero ? (
      <section className="bg-[var(--color-secondary)] py-24 relative overflow-hidden">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {pageConfig.hero.eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{pageConfig.hero.title}</h1>
          <p className="text-gray-300 max-w-xl mx-auto text-base">
            {pageConfig.hero.description}
          </p>
          <nav className="mt-6 flex justify-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-[var(--color-primary)]">Contact Us</span>
          </nav>
        </div>
      </section>
      ) : null}

      {pageConfig.sections.contact_form ? <ContactSection settings={settings} config={pageConfig} /> : null}
      {pageConfig.sections.map ? (
        <MapSection settings={settings} config={pageConfig} showHeading={true} hideLeftpanel />
      ) : null}
      {pageConfig.sections.banner && contactBanner ? (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConfigurableBanner banner={contactBanner} />
          </div>
        </section>
      ) : null}
    </>
  )
}