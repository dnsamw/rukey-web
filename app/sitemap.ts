import { MetadataRoute } from 'next'
import { getServices } from '@/lib/data/fetchers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: 'https://rukey.com.au', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://rukey.com.au/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://rukey.com.au/services', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://rukey.com.au/get-a-quote', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://rukey.com.au/careers', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://rukey.com.au/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `https://rukey.com.au/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...serviceRoutes]
}