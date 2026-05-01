import {
  DEFAULT_SITE_BANNERS,
  type BannerPlacement,
  type SiteBanner,
} from "@/types/banner";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeSiteBanners(input: unknown): SiteBanner[] {
  const rawList = Array.isArray(input)
    ? input.filter(isRecord)
    : [];

  return DEFAULT_SITE_BANNERS.map((defaults) => {
    const existing = rawList.find(
      (item) => item.placement === defaults.placement,
    );

    if (!existing) {
      return defaults;
    }

    return {
      ...defaults,
      ...existing,
      id: typeof existing.id === "string" && existing.id ? existing.id : defaults.id,
      placement: defaults.placement,
      is_enabled: Boolean(existing.is_enabled),
      badge: typeof existing.badge === "string" ? existing.badge : defaults.badge,
      title: typeof existing.title === "string" ? existing.title : defaults.title,
      description:
        typeof existing.description === "string"
          ? existing.description
          : defaults.description,
      cta_label:
        typeof existing.cta_label === "string"
          ? existing.cta_label
          : defaults.cta_label,
      cta_href:
        typeof existing.cta_href === "string" ? existing.cta_href : defaults.cta_href,
      background_color:
        typeof existing.background_color === "string"
          ? existing.background_color
          : defaults.background_color,
      text_color:
        typeof existing.text_color === "string"
          ? existing.text_color
          : defaults.text_color,
      accent_color:
        typeof existing.accent_color === "string"
          ? existing.accent_color
          : defaults.accent_color,
    };
  });
}

export function getBannerForPlacement(
  banners: SiteBanner[] | undefined,
  placement: BannerPlacement,
): SiteBanner | null {
  const match = banners?.find((banner) => banner.placement === placement);
  if (!match || !match.is_enabled) {
    return null;
  }

  return match;
}
