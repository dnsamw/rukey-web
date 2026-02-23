import Image from 'next/image'
import CTAButton from '@/components/public/shared/CTAButton'
import SectionHeading from '@/components/public/shared/SectionHeading'
import { CheckCircle2, Award, Leaf, Shield } from 'lucide-react'

const highlights = [
  'Fully insured and police-checked staff',
  'Eco-friendly, hospital-grade products',
  'Tailored cleaning programs for every client',
  'Servicing all of Victoria and surrounding regions',
  'Available 7 days a week including public holidays',
]

const badges = [
  { icon: Award, label: 'Certified', sub: 'ISO 9001' },
  { icon: Leaf, label: 'Eco Friendly', sub: 'Green Products' },
  { icon: Shield, label: 'Insured', sub: 'Fully Covered' },
]

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Image stack */}
          <div className="relative">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden h-[480px] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
                alt="Professional cleaning team"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)]/40 to-transparent" />
            </div>

            {/* Floating badge — years experience */}
            <div className="absolute -bottom-6 -right-6 bg-[var(--color-primary)] text-white rounded-2xl p-6 shadow-xl">
              <div className="text-4xl font-black leading-none">12+</div>
              <div className="text-sm font-medium text-white mt-1">Years of<br />Experience</div>
            </div>

            {/* Floating badge — clients */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="text-2xl font-black text-[var(--color-secondary)] leading-none">500+</div>
              <div className="text-xs font-medium text-gray-400 mt-1">Happy Clients</div>
            </div>

            {/* Trust badges row */}
            <div className="absolute bottom-6 left-6 flex gap-3">
              {badges.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-md"
                >
                  <div className="w-7 h-7 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                    <Icon size={14} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--color-secondary)] leading-none">{label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <SectionHeading
              label="About Us"
              title="Victoria's Trusted Cleaning Partner"
              subtitle="We are a one-stop facility services solution for all your cleaning requirements throughout Victoria — from Melbourne CBD to surrounding suburbs and rural areas."
              centered={false}
            />

            <p className="text-gray-500 leading-relaxed mb-8">
              Rukey Facility Services delivers a wide range of facility management services for
              councils, offices, education sectors, medical institutions, fitness centres and more.
              We can tailor every service to your exact requirements — whether delivered individually
              or as a complete package.
            </p>

            {/* Highlights list */}
            <ul className="space-y-3 mb-10">
              {highlights.map((point) => (
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