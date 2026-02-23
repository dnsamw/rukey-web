import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/data/fetchers";
import { getIcon } from "@/lib/utils/iconMap";
// import { services } from "@/lib/data/services";
import GetAQuoteBanner from "@/components/public/home/GetAQuoteBanner";
import CTAButton from "@/components/public/shared/CTAButton";
import { createStaticClient } from "@/lib/supabase/static";

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('services')
    .select('slug')
    .eq('is_active', true)

  return (data ?? []).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return { title: 'Service Not Found' }
  }

  return {
    title: service.name,
    description: service.short_description,
    openGraph: {
      title: `${service.name} | Rukey Facility Services`,
      description: service.short_description,
      images: [{ url: service.image_url }],
    },
  }
}

type Props = { params: Promise<{ slug: string }> };

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
  ]);
  if (!service) notFound();

  const Icon = getIcon(service.icon_name);
  const related = allServices.filter((s) => s.slug !== slug).slice(0, 3);

  // const details = serviceDetails[slug] ?? {
  //   fullDescription: service.short_description,
  //   benefits: [],
  //   includes: [],
  // };

  return (
    <>
      {/* Page Hero */}
      <section className="relative bg-[var(--color-secondary)] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src={service.image_url} alt="" fill className="object-cover" />
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 text-sm mb-8">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href="/services"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Services
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[var(--color-primary)]">{service.name}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg">
              <Icon size={26} className="text-white" />
            </div>
            <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Professional Service
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {service.name}
          </h1>
          <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
            {service.short_description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Image */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={service.image_url}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
                  About This Service
                </h2>
                <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full mb-6" />
                <p className="text-gray-500 leading-relaxed">
                  {service.full_description}
                </p>
              </div>

              {/* What's Included */}
              {service.includes.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
                    What's Included
                  </h2>
                  <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.includes.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-[var(--color-primary)] shrink-0 mt-0.5"
                        />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {service.benefits.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
                    Key Benefits
                  </h2>
                  <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full mb-6" />
                  <ul className="space-y-3">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <ArrowRight
                          size={16}
                          className="text-[var(--color-primary)] shrink-0 mt-0.5"
                        />
                        <span className="text-gray-600 text-sm">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* CTA card */}
              <div className="bg-[var(--color-secondary)] rounded-2xl p-7 text-white">
                <h3 className="text-lg font-bold mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Get a free, no-obligation quote for{" "}
                  {service.name.toLowerCase()} tailored to your facility.
                </p>
                <div className="space-y-3">
                  <CTAButton
                    href="/get-a-quote"
                    className="w-full text-center block"
                  >
                    Get a Free Quote
                  </CTAButton>

                  <a
                    href="tel:1300565576"
                    className="w-full flex items-center justify-center gap-2 border border-white/20 text-white py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    <Phone size={15} />
                    1300 565 576
                  </a>
                </div>
              </div>

              {/* Other services */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-[var(--color-secondary)] text-sm mb-4">
                  Other Services
                </h3>
                <div className="space-y-3">
                  {related.map((s) => {
                    const RelIcon = getIcon(s.icon_name);
                    return (
                      <Link
                        key={s.id}
                        href={`/services/${s.slug}`}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition-all group"
                      >
                        <div className="w-9 h-9 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center shrink-0">
                          <RelIcon size={16} className="text-[var(--color-primary)]" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">
                          {s.name}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-gray-300 ml-auto group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all"
                        />
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/services"
                  className="block text-center text-[var(--color-primary)] text-sm font-semibold mt-4 hover:underline"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GetAQuoteBanner />
    </>
  );
}
