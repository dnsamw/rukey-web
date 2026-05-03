export const BANNER_PLACEMENTS = [
//   "hero_right",
  "home_after_services",
  "home_after_about",
  "home_before_contact",
  "about_after_story",
  "services_after_grid",
  "careers_after_roles",
  "contact_after_form",
  "service_detail_after_content",
] as const;

export type BannerPlacement = (typeof BANNER_PLACEMENTS)[number];

export type SiteBanner = {
  id: string;
  placement: BannerPlacement;
  is_enabled: boolean;
  badge: string;
  title: string;
  description: string;
  cta_label: string;
  cta_href: string;
  background_color: string;
  text_color: string;
  accent_color: string;
};

export const DEFAULT_SITE_BANNERS: SiteBanner[] = [
//   {
//     id: "hero_offer",
//     placement: "hero_right",
//     is_enabled: false,
//     badge: "Limited Offer",
//     title: "End of Financial Year Offer",
//     description: "Book before June 30 and get a free deep-clean add-on for your first month.",
//     cta_label: "Claim Offer",
//     cta_href: "/get-a-quote",
//     background_color: "#1E3A5F",
//     text_color: "#FFFFFF",
//     accent_color: "#F97316",
//   },
  {
    id: "home_services",
    placement: "home_after_services",
    is_enabled: false,
    badge: "Popular",
    title: "Bundle Services & Save",
    description: "Combine office cleaning with window cleaning to unlock package pricing.",
    cta_label: "Get Bundle Quote",
    cta_href: "/get-a-quote",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
  {
    id: "home_about",
    placement: "home_after_about",
    is_enabled: false,
    badge: "Trusted Team",
    title: "Need a Site Assessment?",
    description: "Our operations manager can inspect your site and recommend a custom schedule.",
    cta_label: "Book Assessment",
    cta_href: "/contact",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
  {
    id: "home_contact",
    placement: "home_before_contact",
    is_enabled: false,
    badge: "Fast Response",
    title: "Get a Same-Day Callback",
    description: "Send your requirements and we will get back to you during business hours.",
    cta_label: "Contact Us",
    cta_href: "/contact",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
  {
    id: "about_story",
    placement: "about_after_story",
    is_enabled: false,
    badge: "Since 2012",
    title: "Partner With a Proven Team",
    description: "See how our trained staff and QA checks keep facilities spotless year-round.",
    cta_label: "Explore Services",
    cta_href: "/services",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
  {
    id: "services_grid",
    placement: "services_after_grid",
    is_enabled: false,
    badge: "Flexible Plans",
    title: "Not Sure Which Service Fits?",
    description: "Tell us your site type and we will recommend the right cleaning package.",
    cta_label: "Talk to Us",
    cta_href: "/contact",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
  {
    id: "careers_roles",
    placement: "careers_after_roles",
    is_enabled: false,
    badge: "Hiring Now",
    title: "Know Someone Perfect for the Role?",
    description: "Refer a friend and help them build a career with Rukey.",
    cta_label: "Send Resume",
    cta_href: "mailto:careers@rukey.com.au",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
  {
    id: "contact_form",
    placement: "contact_after_form",
    is_enabled: false,
    badge: "Need Urgent Support?",
    title: "Speak to Our Team Directly",
    description: "Call us for urgent facility requirements and immediate scheduling support.",
    cta_label: "Call 1300 565 576",
    cta_href: "tel:1300565576",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
  {
    id: "service_detail",
    placement: "service_detail_after_content",
    is_enabled: false,
    badge: "Tailored Scope",
    title: "Need This Service Weekly?",
    description: "Request a custom scope and get transparent pricing for your facility.",
    cta_label: "Request Quote",
    cta_href: "/get-a-quote",
    background_color: "#1E3A5F",
    text_color: "#FFFFFF",
    accent_color: "#F97316",
  },
];
