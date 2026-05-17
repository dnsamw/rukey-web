export type HeroSlide = {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
  order: number
  is_active: boolean
  // Per-slide optional banner/advert
  banner_enabled: boolean
  banner_layout: 'text' | 'image_link' | 'image_cta' | null
  banner_show_badge: boolean | null
  banner_badge: string | null
  banner_title: string | null
  banner_description: string | null
  banner_cta_label: string | null
  banner_cta_href: string | null
  banner_bg_color: string | null
  banner_text_color: string | null
  banner_accent_color: string | null
  banner_image_url: string | null
  banner_image_href: string | null
  banner_transparent_bg: boolean | null
  banner_drop_shadow: boolean | null
}