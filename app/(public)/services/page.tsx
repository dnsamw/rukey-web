import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/public/shared/SectionHeading";
import GetAQuoteBanner from "@/components/public/home/GetAQuoteBanner";
import { getServices } from "@/lib/data/fetchers";
import { getIcon } from "@/lib/utils/iconMap";
// import { services } from '@/lib/data/services'

export default async function ServicesPage() {
  const services = await getServices();
  const active = services
    .filter((s) => s.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Page Hero */}
      <section className="relative bg-[#1E3A5F] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#F97316]/20 text-[#F97316] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            What We Offer
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Our Cleaning Services
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            Comprehensive facility management solutions tailored to every
            industry — delivered by trained professionals across Australia.
          </p>
          <nav className="mt-6 flex justify-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#F97316]">Our Services</span>
          </nav>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="All Services"
            title="Everything We Clean"
            subtitle="From daily office maintenance to specialised medical sanitation — we have a solution for every facility type."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {active.map((service) => {
              const Icon = getIcon(service.icon_name);
              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#1E3A5F]/0 group-hover:bg-[#1E3A5F]/30 transition-all duration-300" />
                    <div className="absolute top-4 left-4 w-11 h-11 bg-[#F97316] rounded-xl flex items-center justify-center shadow-lg">
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-[#1E3A5F] mb-2 group-hover:text-[#F97316] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">
                      {service.short_description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[#F97316] text-sm font-semibold">
                      View Service
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <GetAQuoteBanner />
    </>
  );
}
