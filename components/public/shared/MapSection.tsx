import { MapPin, Phone, Mail, ExternalLink, Clock } from "lucide-react";
import SectionHeading from "@/components/public/shared/SectionHeading";
import type { SiteSettingsData } from "@/lib/data/fetchers";

type Props = {
  settings: SiteSettingsData;
  showHeading?: boolean;
  hideLeftpanel?: boolean; 
};

export default function MapSection({ settings, showHeading = true, hideLeftpanel = false }: Props) {
  const { addresses, general } = settings;

  // Use first address as main office
  const mainOffice = addresses[0];
  if (!mainOffice) return null;

  // Build Google Maps embed URL — plain search query, no API key needed
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mainOffice.address,
  )}&output=embed&z=15`;

  // Build Google Maps directions/search URL for the button
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mainOffice.address,
  )}`;

  const businessHours = [
    { day: "Monday – Friday", hours: "7:00 AM – 6:00 PM" },
    { day: "Saturday", hours: "8:00 AM – 4:00 PM" },
    { day: "Sunday", hours: "By Appointment" },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHeading
            label="Find Us"
            title="Our Main Office"
            subtitle="Visit us or get in touch — our team is ready to help with your facility cleaning needs."
          />
        )}

        <div className={`${hideLeftpanel ? "grid grid-cols-1 lg:grid-cols-1" : "grid grid-cols-1 lg:grid-cols-3"} gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-100`}>
          {/* ── Left info panel ── */}
          {!hideLeftpanel && <div className="bg-[var(--color-secondary)] text-white p-8 flex flex-col gap-8">
            {/* Main office */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    Main Office
                  </div>
                  <div className="font-bold text-white leading-tight">
                    {mainOffice.area}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pl-1">
                {mainOffice.address}
              </p>
            </div>

            {/* Other locations */}
            {addresses.length > 1 && (
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">
                  Other Locations
                </div>
                <div className="space-y-3">
                  {addresses.slice(1).map((office) => (
                    <div key={office.area} className="flex items-start gap-2.5">
                      <MapPin
                        size={13}
                        className="text-[var(--color-primary)] shrink-0 mt-0.5"
                      />
                      <div>
                        <div className="text-white text-xs font-semibold">
                          {office.area}
                        </div>
                        <div className="text-gray-400 text-xs leading-relaxed">
                          {office.address}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business hours */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-[var(--color-primary)]" />
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Business Hours
                </div>
              </div>
              <div className="space-y-2">
                {businessHours.map(({ day, hours }) => (
                  <div
                    key={day}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="text-gray-400">{day}</span>
                    <span className="text-white font-semibold">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <a
                href={`tel:${general.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-gray-300 hover:text-[var(--color-primary)] transition-colors text-sm group"
              >
                <div className="w-8 h-8 bg-white/10 group-hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors shrink-0">
                  <Phone size={14} />
                </div>
                {general.phone}
              </a>

              <a
                href={`mailto:${general.email}`}
                className="flex items-center gap-3 text-gray-300 hover:text-[var(--color-primary)] transition-colors text-sm group"
              >
                <div className="w-8 h-8 bg-white/10 group-hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center transition-colors shrink-0">
                  <Mail size={14} />
                </div>
                {general.email}
              </a>
            </div>

            {/* CTA */}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-colors mt-auto"
            >
              <ExternalLink size={15} />
              Get Directions
            </a>
          </div>}

          {/* ── Right — Google Maps embed ── */}
          <div className="lg:col-span-2 min-h-[420px] relative bg-gray-100">
            {/* Subtle overlay top-left badge */}
            <div className="absolute top-4 left-4 z-10 bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-600">
                {general.company_name}
              </span>
            </div>

            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "420px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${general.company_name} location — ${mainOffice.area}`}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
