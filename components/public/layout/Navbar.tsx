"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import CTAButton from "@/components/public/shared/CTAButton";
import type { SiteSettingsData } from "@/lib/data/fetchers";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

type Props = { settings: SiteSettingsData };

export default function Navbar({ settings }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const { general } = settings;

  return (
    <>
      {/* Top bar */}
      <div className="bg-[var(--color-secondary)] text-white text-sm py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-gray-300">{general.tagline}</span>

          <a
            href={`tel:${general.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:text-white transition-colors"
          >
            <Phone size={14} />
            {general.phone}
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/40 backdrop-blur-md shadow-md"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo text*/}
            {/* <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">
                  {general.company_name.charAt(0)}
                </span>
              </div>
              <div className="leading-tight">
                <span className="block font-black text-[var(--color-secondary)] text-lg">
                  {general.company_name.split(" ")[0]}
                </span>
                <span className="block text-xs text-gray-400 font-medium">
                  {general.company_name.split(" ").slice(1).join(" ")}
                </span>
              </div>
            </Link> */}

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/rukey-logo.png"
                alt={general.company_name}
                width={150}
                height={50}
                className="rounded-lg w-24 h-auto md:w-36 lg:w-[150px]"
                priority
                unoptimized
              />
              {/* <div className="leading-tight">
                <span className="block font-black text-[var(--color-secondary)] text-lg">
                  {general.company_name.split(" ")[0]}
                </span>
                <span className="block text-xs text-gray-400 font-medium">
                  {general.company_name.split(" ").slice(1).join(" ")}
                </span>
              </div> */}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "text-gray-600 hover:text-[var(--color-primary)] hover:bg-primary-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <CTAButton href="/get-a-quote" className="hidden md:inline-block">
                Get a Quote
              </CTAButton>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"}`}
        >
          <nav className="px-4 py-4 flex flex-col gap-1 bg-white">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[var(--color-primary)] bg-orange-50"
                      : "text-gray-600 hover:text-[var(--color-primary)] hover:bg-orange-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Phone in mobile menu */}

            <a
              href={`tel:${general.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--color-primary)]"
            >
              <Phone size={15} />
              {general.phone}
            </a>
            <div className="pt-2">
              <CTAButton href="/get-a-quote" className="w-full text-center">
                Get a Quote
              </CTAButton>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
