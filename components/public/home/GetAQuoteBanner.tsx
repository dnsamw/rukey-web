import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import type { SiteSettingsData } from '@/lib/data/fetchers'

type Props = { settings?: SiteSettingsData }

export default function GetAQuoteBanner({ settings }: Props) {
  // TODO - debug - phone number is not showing up in the banner.
  const phone = settings?.general.phone ?? '1300 565 576'

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--color-secondary)]" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--color-primary)]/10 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left max-w-2xl">
            <span className="inline-block bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Free Consultation
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Ready for a Cleaner,{' '}
              <span className="text-[var(--color-primary)]">Healthier</span>{' '}
              Facility?
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Get a free, no-obligation quote tailored to your facility. Our team will assess your
              needs and build a cleaning program that fits your schedule and budget.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
            <Link
              href="/get-a-quote"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold hover:bg-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get a Free Quote
              <ArrowRight size={18} />
            </Link>
            
            <a  href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-200"
            >
              <Phone size={18} className="text-[var(--color-primary)]" />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}