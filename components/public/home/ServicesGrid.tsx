import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/public/shared/SectionHeading";
import { getIcon } from "@/lib/utils/iconMap";
import type { Service } from "@/types/service";

type Props = { services: Service[] };

export default function ServicesGrid({ services }: Props) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="What We Do"
          title="Our Cleaning Services"
          subtitle="From offices to hospitals, schools to gyms — we deliver professional cleaning solutions tailored to every environment across Australia."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services?.map((service) => {
            const Icon = getIcon(service.icon_name);
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image_url}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[var(--color-secondary)]/0 group-hover:bg-[var(--color-secondary)]/40 transition-all duration-300" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[var(--color-secondary)] text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {service.short_description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[var(--color-primary)] text-sm font-semibold">
                    Learn More
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[var(--color-secondary)] text-white px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-primary)] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            View All Services <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
