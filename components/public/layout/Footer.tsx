import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

const services = [
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

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">C</span>
              </div>
              <div className="leading-tight">
                <span className="block font-black text-white text-lg">
                  CleanPro
                </span>
                <span className="block text-xs text-gray-400 font-medium">
                  Facility Services
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Professional cleaning solutions for commercial, educational,
              medical and industrial facilities across Australia.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#1" },
                { icon: Instagram, href: "#2" },
                { icon: Linkedin, href: "#3" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#F97316] transition-colors"
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
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-gray-400 text-sm hover:text-[#F97316] transition-colors"
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
                    className="text-gray-400 text-sm hover:text-[#F97316] transition-colors"
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
                  href="tel:1300565576"
                  className="flex items-center gap-3 text-gray-400 text-sm hover:text-[#F97316] transition-colors"
                >
                  <Phone size={16} className="text-[#F97316] shrink-0" />
                  1300 565 576
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@cleanpro.com.au"
                  className="flex items-center gap-3 text-gray-400 text-sm hover:text-[#F97316] transition-colors"
                >
                  <Mail size={16} className="text-[#F97316] shrink-0" />
                  info@cleanpro.com.au
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                <span>17 Citrus Street Braeside, VIC 3195</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CleanPro Facility Services. All rights
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
