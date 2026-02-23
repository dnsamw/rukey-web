import { createClient } from '@/lib/supabase/server'
import type { HeroSlide } from '@/types/hero'
import type { Service } from '@/types/service'

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) { console.error('getHeroSlides:', error); return [] }
  return data ?? []
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) { console.error('getServices:', error); return [] }
  return data ?? []
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) { console.error('getServiceBySlug:', error); return null }
  return data
}

export async function getTestimonials() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) { console.error('getTestimonials:', error); return [] }
  return data ?? []
}

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) { console.error('getSiteSettings:', error); return {} }

  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]))
}