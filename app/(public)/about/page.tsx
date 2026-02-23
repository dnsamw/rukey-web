import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Users, Award, Leaf, Shield } from 'lucide-react'
import SectionHeading from '@/components/public/shared/SectionHeading'
import VisionMissionValues from '@/components/public/home/VisionMissionValues'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import GetAQuoteBanner from '@/components/public/home/GetAQuoteBanner'

export const metadata = {
  title: 'About Us',
  description:
    "Learn about Rukey's 12+ year history, our mission, values and the team behind Victoria's most trusted facility cleaning company.",
}

const team = [
  { name: 'Michael Chen', role: 'Founder & CEO', initials: 'MC', color: 'bg-[var(--color-secondary)]' },
  { name: 'Angela Torres', role: 'Operations Manager', initials: 'AT', color: 'bg-[var(--color-primary)]' },
  { name: 'James Patel', role: 'Head of Training', initials: 'JP', color: 'bg-emerald-500' },
  { name: 'Rachel Kim', role: 'Client Relations', initials: 'RK', color: 'bg-purple-500' },
]

const milestones = [
  { year: '2012', event: 'Founded in Melbourne with a team of 5' },
  { year: '2015', event: 'Expanded into education and healthcare sectors' },
  { year: '2018', event: 'Opened regional offices across Victoria' },
  { year: '2021', event: 'Achieved ISO 9001 quality certification' },
  { year: '2024', event: '500+ active clients across Australia' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
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
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Rukey</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            Over a decade of delivering trusted, professional facility services across Victoria and beyond.
          </p>
          <nav className="mt-6 flex justify-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-[var(--color-primary)]">About Us</span>
          </nav>
        </div>
      </section>

      {/* Story + Image */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[460px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=900&q=80"
                  alt="Rukey team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[var(--color-primary)] text-white rounded-2xl p-6 shadow-xl">
                <div className="text-4xl font-black leading-none">12+</div>
                <div className="text-sm font-medium text-orange-100 mt-1">Years Trusted</div>
              </div>
            </div>
            <div>
              <SectionHeading
                label="Who We Are"
                title="Victoria's Cleaning Specialists Since 2012"
                centered={false}
              />
              <p className="text-gray-500 leading-relaxed mb-5">
                Rukey Facility Services was founded in Melbourne in 2012 with a simple mission — to deliver
                cleaning services so reliable and thorough that our clients never have to think about it again.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                From a small team of five, we've grown into one of Victoria's most trusted facility management
                companies — serving 500+ clients across offices, schools, hospitals, gyms and government buildings.
                Every member of our team is trained, vetted and shares our commitment to excellence.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, label: 'ISO 9001 Certified' },
                  { icon: Leaf, label: 'Eco-Friendly Products' },
                  { icon: Shield, label: 'Fully Insured' },
                  { icon: Users, label: 'Police Checked Staff' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                    <Icon size={18} className="text-[var(--color-primary)] shrink-0" />
                    <span className="text-sm font-semibold text-[var(--color-secondary)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Journey" title="How We Got Here" />
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
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

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Meet the Team" title="The People Behind Rukey" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className={`${member.color} w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 group-hover:scale-105 transition-transform duration-200 shadow-md`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-[var(--color-secondary)] text-sm">{member.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VisionMissionValues />
      <WhyChooseUs />
      <GetAQuoteBanner />
    </>
  )
}
