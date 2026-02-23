import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/public/shared/SectionHeading'
import { services } from '@/lib/data/services'

export default function ServicesGrid() {
  const activeServices = services
    .filter((s) => s.is_active)
    .sort((a, b) => a.order - b.order)

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          label="What We Do"
          title="Our Cleaning Services"
          subtitle="From offices to hospitals, schools to gyms — we deliver professional cleaning solutions tailored to every environment across Australia."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeServices.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image_url}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-[#1E3A5F]/0 group-hover:bg-[#1E3A5F]/40 transition-all duration-300" />

                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-lg">
                    <Icon size={18} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-[#1E3A5F] text-base mb-2 group-hover:text-[#F97316] transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {service.short_description}
                  </p>

                  {/* Learn more */}
                  <span className="inline-flex items-center gap-1.5 text-[#F97316] text-sm font-semibold">
                    Learn More
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            )
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#1E3A5F] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#F97316] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  )
}
