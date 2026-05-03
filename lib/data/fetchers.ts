import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/types/hero";
import type { Service } from "@/types/service";
import { DEFAULT_SITE_BANNERS, type SiteBanner } from "@/types/banner";
import { normalizeSiteBanners } from "@/lib/utils/banners";
import {
  defaultAboutPageConfig,
  defaultCareersPageConfig,
  defaultContactPageConfig,
  type AboutPageConfig,
  type CareersPageConfig,
  type ContactPageConfig,
} from "@/types/page-config";

export type SiteSettingsData = {
  general: {
    company_name: string
    tagline: string
    phone: string
    email: string
    abn: string
  }
  addresses: { area: string; address: string }[]
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  theme: {
    primary: string
    primary_dark: string
    secondary: string
    secondary_dark: string
  }
}

export type JobPosting = {
  id: string
  title: string
  description: string
  location: string
  employment_type: string | null
  salary_min: number | null
  salary_max: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("getHeroSlides:", error);
    return [];
  }
  return data ?? [];
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("getServices:", error);
    return [];
  }
  return data ?? [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("getServiceBySlug:", error);
    return null;
  }
  return data;
}

export async function getTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("getTestimonials:", error);
    return [];
  }
  return data ?? [];
}

const defaultSettings: SiteSettingsData = {
  general: {
    company_name: "Rukey Facility Services",
    tagline: "Professional Cleaning Across Australia",
    phone: "1300 565 576",
    email: "info@rukey.com.au",
    abn: "",
  },
  addresses: [
    { area: "Braeside", address: "17 Citrus Street Braeside, VIC 3195" },
  ],
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
  theme: {
    primary: '#F97316',
    primary_dark: '#EA6C0A',
    secondary: '#1E3A5F',
    secondary_dark: '#162d4a',
  },
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error || !data) return defaultSettings;

    const map = Object.fromEntries(data.map((row) => [row.key, row.value]));

    return {
      general: map.general ?? defaultSettings.general,
      addresses: map.addresses ?? defaultSettings.addresses,
      social: map.social ?? defaultSettings.social,
      theme: map.theme ?? defaultSettings.theme,
    };
  } catch {
    return defaultSettings;
  }
}

export async function getBanners(): Promise<SiteBanner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("placement", { ascending: true });

    if (error || !data) return DEFAULT_SITE_BANNERS;

    return normalizeSiteBanners(data);
  } catch {
    return DEFAULT_SITE_BANNERS;
  }
}

function mergeSectionFlags(
  defaults: Record<string, boolean>,
  source?: Record<string, boolean>,
) {
  return {
    ...defaults,
    ...(source ?? {}),
  }
}

export async function getAboutPageConfig(): Promise<AboutPageConfig> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "about_page")
      .maybeSingle();

    if (error || !data?.value) return defaultAboutPageConfig;

    const value = data.value as Partial<AboutPageConfig>;

    return {
      ...defaultAboutPageConfig,
      ...value,
      sections: mergeSectionFlags(defaultAboutPageConfig.sections, value.sections),
      hero: { ...defaultAboutPageConfig.hero, ...(value.hero ?? {}) },
      story: {
        ...defaultAboutPageConfig.story,
        ...(value.story ?? {}),
        badges: value.story?.badges ?? defaultAboutPageConfig.story.badges,
      },
      timeline: {
        ...defaultAboutPageConfig.timeline,
        ...(value.timeline ?? {}),
        items: value.timeline?.items ?? defaultAboutPageConfig.timeline.items,
      },
      team: {
        ...defaultAboutPageConfig.team,
        ...(value.team ?? {}),
        members: value.team?.members ?? defaultAboutPageConfig.team.members,
      },
    };
  } catch {
    return defaultAboutPageConfig;
  }
}

export async function getContactPageConfig(): Promise<ContactPageConfig> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact_page")
      .maybeSingle();

    if (error || !data?.value) return defaultContactPageConfig;

    const value = data.value as Partial<ContactPageConfig>;

    return {
      ...defaultContactPageConfig,
      ...value,
      sections: mergeSectionFlags(defaultContactPageConfig.sections, value.sections),
      hero: { ...defaultContactPageConfig.hero, ...(value.hero ?? {}) },
      contact: {
        ...defaultContactPageConfig.contact,
        ...(value.contact ?? {}),
        service_options:
          value.contact?.service_options ?? defaultContactPageConfig.contact.service_options,
      },
      map: { ...defaultContactPageConfig.map, ...(value.map ?? {}) },
      offices: value.offices ?? defaultContactPageConfig.offices,
      business_hours: value.business_hours ?? defaultContactPageConfig.business_hours,
    };
  } catch {
    return defaultContactPageConfig;
  }
}

export async function getCareersPageConfig(): Promise<CareersPageConfig> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "careers_page")
      .maybeSingle();

    if (error || !data?.value) return defaultCareersPageConfig;

    const value = data.value as Partial<CareersPageConfig>;

    return {
      ...defaultCareersPageConfig,
      ...value,
      sections: mergeSectionFlags(defaultCareersPageConfig.sections, value.sections),
      hero: { ...defaultCareersPageConfig.hero, ...(value.hero ?? {}) },
      perks: {
        ...defaultCareersPageConfig.perks,
        ...(value.perks ?? {}),
        items: value.perks?.items ?? defaultCareersPageConfig.perks.items,
      },
      jobs: { ...defaultCareersPageConfig.jobs, ...(value.jobs ?? {}) },
      fallback: {
        ...defaultCareersPageConfig.fallback,
        ...(value.fallback ?? {}),
      },
    };
  } catch {
    return defaultCareersPageConfig;
  }
}

export async function getJobPostings(activeOnly = true): Promise<JobPosting[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false });

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    return data;
  } catch {
    return [];
  }
}
