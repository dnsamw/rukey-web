import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/data/fetchers";
import { getIcon } from "@/lib/utils/iconMap";
// import { services } from "@/lib/data/services";
import GetAQuoteBanner from "@/components/public/home/GetAQuoteBanner";
import CTAButton from "@/components/public/shared/CTAButton";

// const serviceDetails: Record<
//   string,
//   {
//     fullDescription: string;
//     benefits: string[];
//     includes: string[];
//   }
// > = {
//   office: {
//     fullDescription:
//       "Our office cleaning service is designed to create a productive, hygienic workplace that makes a great impression on clients and staff alike. We work around your schedule — early mornings, evenings or weekends — to ensure zero disruption to your business.",
//     benefits: [
//       "Improved staff wellbeing and productivity",
//       "Professional impression for visiting clients",
//       "Reduced sick days through better hygiene",
//       "Customised frequency and schedule",
//       "Dedicated account manager",
//     ],
//     includes: [
//       "Vacuuming and mopping all floor surfaces",
//       "Dusting and sanitising desks and surfaces",
//       "Kitchen and breakroom cleaning",
//       "Bathroom sanitisation",
//       "Bin emptying and recycling management",
//       "Glass and window cleaning",
//     ],
//   },
//   school: {
//     fullDescription:
//       "Schools and educational facilities require a unique level of care. Our education cleaning team understands the importance of safe, non-toxic products and thorough sanitation in high-traffic areas used by children and staff every day.",
//     benefits: [
//       "Safe, non-toxic products for children",
//       "Reduced spread of illness",
//       "Clean learning environments that support focus",
//       "Holiday deep-clean programs available",
//       "Compliance with health and safety standards",
//     ],
//     includes: [
//       "Classroom cleaning and sanitisation",
//       "Toilet block deep-cleaning",
//       "Canteen and food area hygiene",
//       "Gymnasium and sports hall maintenance",
//       "Administration area cleaning",
//       "Playground and outdoor area upkeep",
//     ],
//   },
//   medical: {
//     fullDescription:
//       "Medical and healthcare facilities demand the highest standards of cleanliness. Our team is trained in infection control protocols and uses hospital-grade disinfectants to protect patients, staff and visitors from cross-contamination.",
//     benefits: [
//       "Hospital-grade disinfection protocols",
//       "Infection control compliance",
//       "Trained in biohazard handling",
//       "Colour-coded equipment to prevent cross-contamination",
//       "Detailed cleaning audit trails",
//     ],
//     includes: [
//       "Patient room and ward sanitisation",
//       "Operating theatre and procedure room cleaning",
//       "Reception and waiting area hygiene",
//       "Medical waste area management",
//       "Staff room and locker area cleaning",
//       "Bathroom and sluice room sanitisation",
//     ],
//   },
//   gym: {
//     fullDescription:
//       "Fitness centres are breeding grounds for bacteria if not properly maintained. Our gym cleaning team deep-cleans all equipment, change rooms and common areas to give your members a safe, fresh environment they love coming back to.",
//     benefits: [
//       "Eliminates gym bacteria and odours",
//       "Improved member retention through cleanliness",
//       "Equipment longevity through proper cleaning",
//       "Flexible scheduling around gym hours",
//       "Odour-neutralising treatments",
//     ],
//     includes: [
//       "Gym equipment wipe-down and sanitisation",
//       "Change room and shower deep-cleaning",
//       "Sauna and steam room maintenance",
//       "Reception and lounge area cleaning",
//       "Floor scrubbing and polishing",
//       "Mirror and glass cleaning",
//     ],
//   },
//   council: {
//     fullDescription:
//       "Local councils and government facilities serve the public — and the public expects clean, welcoming spaces. We provide reliable, consistent cleaning services for civic buildings, libraries, community halls and public amenities.",
//     benefits: [
//       "Reliable and consistent service delivery",
//       "Experience with public sector requirements",
//       "Fully insured and police-checked staff",
//       "Eco-friendly products for public spaces",
//       "Flexible contract terms",
//     ],
//     includes: [
//       "Council chambers and office cleaning",
//       "Library and community centre maintenance",
//       "Public toilet block management",
//       "Reception and customer service area hygiene",
//       "Meeting room preparation",
//       "Outdoor area and carpark maintenance",
//     ],
//   },
//   retail: {
//     fullDescription:
//       "A clean retail environment directly impacts customer experience and sales. Our retail cleaning team ensures your store always looks its best — from the entrance to the fitting rooms — so customers feel confident and comfortable.",
//     benefits: [
//       "Enhanced customer shopping experience",
//       "Consistent brand presentation",
//       "Before-hours service to avoid disruption",
//       "Specialised floor care programs",
//       "Seasonal deep-clean packages",
//     ],
//     includes: [
//       "Shop floor vacuuming and mopping",
//       "Display and shelving dusting",
//       "Fitting room and mirror cleaning",
//       "Staff room and bathroom maintenance",
//       "Entrance and facade cleaning",
//       "Rubbish removal and recycling",
//     ],
//   },
//   industrial: {
//     fullDescription:
//       "Industrial sites present unique cleaning challenges that require specialist equipment, training and safety procedures. Our industrial cleaning team handles warehouses, factories and manufacturing facilities with the thoroughness and safety compliance your site demands.",
//     benefits: [
//       "Specialist equipment for large spaces",
//       "Safety-compliant cleaning procedures",
//       "Hazardous material handling training",
//       "Scheduled and emergency cleaning available",
//       "WHS compliant at all times",
//     ],
//     includes: [
//       "Warehouse floor scrubbing and sweeping",
//       "Loading dock and bay cleaning",
//       "Factory equipment exterior cleaning",
//       "Office and amenity area maintenance",
//       "Spill response and clean-up",
//       "High-pressure washing",
//     ],
//   },
//   window: {
//     fullDescription:
//       "Clean windows transform the look of any building and let natural light flood in. Our window cleaning team handles everything from single-storey shopfronts to multi-storey commercial buildings using the latest reach-and-wash technology.",
//     benefits: [
//       "Streak-free, crystal-clear results",
//       "Safe rope-access for high-rise buildings",
//       "Water-fed pole system for mid-rise",
//       "Regular scheduled programs",
//       "Internal and external cleaning",
//     ],
//     includes: [
//       "External facade window cleaning",
//       "Internal glass and partition cleaning",
//       "Shopfront and entrance glass",
//       "Skylight and roof light cleaning",
//       "Frame and sill wipe-down",
//       "High-rise rope access cleaning",
//     ],
//   },
// };

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
      title: `${service.name} | CleanPro Facility Services`,
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
      <section className="relative bg-[#1E3A5F] py-24 overflow-hidden">
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
            <span className="text-[#F97316]">{service.name}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[#F97316] rounded-2xl flex items-center justify-center shadow-lg">
              <Icon size={26} className="text-white" />
            </div>
            <span className="bg-[#F97316]/20 text-[#F97316] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
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
                <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4">
                  About This Service
                </h2>
                <div className="h-1 w-12 bg-[#F97316] rounded-full mb-6" />
                <p className="text-gray-500 leading-relaxed">
                  {service.full_description}
                </p>
              </div>

              {/* What's Included */}
              {service.includes.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4">
                    What's Included
                  </h2>
                  <div className="h-1 w-12 bg-[#F97316] rounded-full mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.includes.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-[#F97316] shrink-0 mt-0.5"
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
                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4">
                    Key Benefits
                  </h2>
                  <div className="h-1 w-12 bg-[#F97316] rounded-full mb-6" />
                  <ul className="space-y-3">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <ArrowRight
                          size={16}
                          className="text-[#F97316] shrink-0 mt-0.5"
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
              <div className="bg-[#1E3A5F] rounded-2xl p-7 text-white">
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
                <h3 className="font-bold text-[#1E3A5F] text-sm mb-4">
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
                        <div className="w-9 h-9 bg-[#F97316]/10 rounded-lg flex items-center justify-center shrink-0">
                          <RelIcon size={16} className="text-[#F97316]" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#F97316] transition-colors">
                          {s.name}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-gray-300 ml-auto group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all"
                        />
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/services"
                  className="block text-center text-[#F97316] text-sm font-semibold mt-4 hover:underline"
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
