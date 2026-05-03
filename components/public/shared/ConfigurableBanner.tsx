import Link from "next/link";
import type { SiteBanner } from "@/types/banner";

type Props = {
  banner: SiteBanner | null;
  compact?: boolean;
  className?: string;
};

export default function ConfigurableBanner({
  banner,
  compact = false,
  className = "",
}: Props) {
  if (!banner || !banner.is_enabled) {
    return null;
  }

  const backgroundColor = banner.background_color || "var(--color-secondary)";
  const textColor = banner.text_color || "#FFFFFF";
  const accentColor = banner.accent_color || "var(--color-primary)";

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-xl ${compact ? "p-5" : "p-8 md:p-10"} ${className}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-black/10" />
      <div className="relative">
        {banner.badge ? (
          <span
            className="mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            {banner.badge}
          </span>
        ) : null}

        <h3 className={`${compact ? "text-xl" : "text-2xl md:text-3xl"} font-black leading-tight`}>
          {banner.title}
        </h3>

        {banner.description ? (
          <p className={`${compact ? "mt-3 text-sm" : "mt-4 text-base"} max-w-2xl opacity-90`}>
            {banner.description}
          </p>
        ) : null}

        {banner.cta_label && banner.cta_href ? (
          <div className="mt-6">
            <Link
              href={banner.cta_href}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors"
              style={{ backgroundColor: accentColor, color: "#FFFFFF" }}
            >
              {banner.cta_label}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
