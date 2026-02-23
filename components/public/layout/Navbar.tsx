"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import CTAButton from "@/components/public/shared/CTAButton";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1E3A5F] text-white text-sm py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-gray-300">
            Professional Cleaning Services Across Australia
          </span>

          <a
            href="tel:1300565576"
            className="flex items-center gap-2 text-[#F97316] font-semibold hover:text-orange-400 transition-colors"
          >
            <Phone size={14} />
            1300 565 576
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">C</span>
              </div>
              <div className="leading-tight">
                <span className="block font-black text-[#1E3A5F] text-lg">
                  CleanPro
                </span>
                <span className="block text-xs text-gray-400 font-medium">
                  Facility Services
                </span>
              </div>
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
                        ? "text-[#F97316] bg-orange-50"
                        : "text-gray-600 hover:text-[#F97316] hover:bg-orange-50"
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
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
          }`}
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
                      ? "text-[#F97316] bg-orange-50"
                      : "text-gray-600 hover:text-[#F97316] hover:bg-orange-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
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
