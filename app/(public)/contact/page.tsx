import Link from 'next/link'
import ContactSection from '@/components/public/home/ContactSection'
import { getSiteSettings } from '@/lib/data/fetchers'

export default async function ContactPage() {
    const settings = await getSiteSettings();
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1E3A5F] py-24 relative overflow-hidden">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#F97316]/20 text-[#F97316] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            We'd Love to Hear From You
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-xl mx-auto text-base">
            Have a question, want a quote, or just want to learn more? Our friendly team is here to help.
          </p>
          <nav className="mt-6 flex justify-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#F97316]">Contact Us</span>
          </nav>
        </div>
      </section>

      <ContactSection settings={settings} />
    </>
  )
}