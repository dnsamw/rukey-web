import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/types/hero";
import type { Service } from "@/types/service";

export type SiteSettingsData = {
  general: {
    company_name: string;
    tagline: string;
    phone: string;
    email: string;
    abn: string;
  };
  addresses: { area: string; address: string }[];
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
};

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
    company_name: "CleanPro Facility Services",
    tagline: "Professional Cleaning Across Australia",
    phone: "1300 565 576",
    email: "info@cleanpro.com.au",
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
    };
  } catch {
    return defaultSettings;
  }
}
