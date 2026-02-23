import Link from 'next/link'
import { MapPin, Clock, ArrowRight, Heart } from 'lucide-react'
import SectionHeading from '@/components/public/shared/SectionHeading'
import GetAQuoteBanner from '@/components/public/home/GetAQuoteBanner'

export const metadata = {
  title: 'Careers',
  description:
    'Join the Rukey team. Browse current job openings across Victoria and build a rewarding career with one of Australia\'s most respected cleaning companies.',
}

const jobs = [
  { id: '1', title: 'Commercial Cleaner', location: 'Melbourne, VIC', type: 'Full-time', department: 'Operations' },
  { id: '2', title: 'Team Leader — Office Cleaning', location: 'Geelong, VIC', type: 'Full-time', department: 'Operations' },
  { id: '3', title: 'Medical Facility Cleaner', location: 'Melbourne, VIC', type: 'Part-time', department: 'Healthcare' },
  { id: '4', title: 'Window Cleaning Technician', location: 'Melbourne CBD, VIC', type: 'Full-time', department: 'Specialist' },
  { id: '5', title: 'Operations Coordinator', location: 'Braeside, VIC', type: 'Full-time', department: 'Administration' },
]

const perks = [
  { icon: '🕐', label: 'Flexible Hours' },
  { icon: '💼', label: 'Stable Employment' },
  { icon: '📈', label: 'Career Growth' },
  { icon: '🛡️', label: 'Full Insurance Cover' },
  { icon: '🌿', label: 'Eco-Friendly Workplace' },
  { icon: '🤝', label: 'Supportive Team' },
]

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-secondary)] py-24 relative overflow-hidden">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Join Our Team
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Careers at CleanPro</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            Build a rewarding career with one of Victoria's most respected facility services companies. We invest in our people.
          </p>
          <nav className="mt-6 flex justify-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-[var(--color-primary)]">Careers</span>
          </nav>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Why Work With Us" title="What We Offer Our Team" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {perks.map((p) => (
              <div key={p.label} className="bg-gray-50 rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{p.icon}</div>
                <div className="text-sm font-semibold text-[var(--color-secondary)]">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Open Positions" title="Current Opportunities" />
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold px-2.5 py-1 rounded-full">
                      {job.department}
                    </span>
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock size={11} /> {job.type}
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
                  href={`/careers/${job.id}`}
                  className="inline-flex items-center gap-2 bg-[var(--color-secondary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--color-primary)] transition-colors shrink-0"
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          {/* No fit */}
          <div className="mt-10 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-2xl p-8 text-center">
            <Heart size={28} className="text-[var(--color-primary)] mx-auto mb-3" />
            <h3 className="font-bold text-[var(--color-secondary)] mb-2">Don't see a role that fits?</h3>
            <p className="text-gray-500 text-sm mb-5">
              We're always on the lookout for great people. Send us your resume and we'll keep you in mind.
            </p>
            
            <a  href="mailto:careers@cleanpro.com.au"
              className="inline-block bg-[var(--color-primary)] text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Send Your Resume
            </a>
          </div>
        </div>
      </section>

      <GetAQuoteBanner />
    </>
  )
}