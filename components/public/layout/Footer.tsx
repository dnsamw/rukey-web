import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import type { SiteSettingsData } from "@/lib/data/fetchers";

const serviceLinks = [
  { label: "Office Cleaning", href: "/services/office" },
  { label: "School Cleaning", href: "/services/school" },
  { label: "Medical Cleaning", href: "/services/medical" },
  { label: "Gym Cleaning", href: "/services/gym" },
  { label: "Window Cleaning", href: "/services/window" },
  { label: "Floor Maintenance", href: "/services/floor" },
];

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Get a Quote", href: "/get-a-quote" },
  { label: "Contact Us", href: "/contact" },
];

type Props = { settings: SiteSettingsData };

export default function Footer({ settings }: Props) {
  const { general, addresses, social } = settings;

  const socialLinks = [
    { icon: Facebook, href: social.facebook, label: "Facebook" },
    { icon: Instagram, href: social.instagram, label: "Instagram" },
    { icon: Linkedin, href: social.linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-[var(--color-secondary)] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">
                  {general.company_name.charAt(0)}
                </span>
              </div>
              <div className="leading-tight">
                <span className="block font-black text-white text-lg">
                  {general.company_name.split(" ")[0]}
                </span>
                <span className="block text-xs text-gray-400 font-medium">
                  {general.company_name.split(" ").slice(1).join(" ")}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              {general.tagline}
            </p>
            {general.abn && (
              <p className="text-gray-500 text-xs mb-6">ABN: {general.abn}</p>
            )}

            {/* Socials */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href || "#"}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Our Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-gray-400 text-sm hover:text-[var(--color-primary)] transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-400 text-sm hover:text-[var(--color-primary)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${general.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-gray-400 text-sm hover:text-[var(--color-primary)] transition-colors"
                >
                  <Phone size={16} className="text-[var(--color-primary)] shrink-0" />
                  {general.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${general.email}`}
                  className="flex items-center gap-3 text-gray-400 text-sm hover:text-[var(--color-primary)] transition-colors"
                >
                  <Mail size={16} className="text-[var(--color-primary)] shrink-0" />
                  {general.email}
                </a>
              </li>

              {/* Dynamic office addresses */}
              {addresses.slice(0, 2).map((office) => (
                <li
                  key={office.area}
                  className="flex items-start gap-3 text-gray-400 text-sm"
                >
                  <MapPin
                    size={16}
                    className="text-[var(--color-primary)] shrink-0 mt-0.5"
                  />
                  <span>
                    <span className="text-gray-300 font-medium">
                      {office.area}:{" "}
                    </span>
                    {office.address}
                  </span>
                </li>
              ))}

              {/* Show remaining count if more than 2 */}
              {addresses.length > 2 && (
                <li>
                  <Link
                    href="/contact"
                    className="text-[var(--color-primary)] text-xs font-semibold hover:underline ml-7"
                  >
                    +{addresses.length - 2} more locations →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {general.company_name}. All rights
            reserved.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
