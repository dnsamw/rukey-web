import HeroSlider from '@/components/public/home/HeroSlider'
import StatsBar from '@/components/public/home/StatsBar'
import ServicesGrid from '@/components/public/home/ServicesGrid'
import AboutSection from '@/components/public/home/AboutSection'
import VisionMissionValues from '@/components/public/home/VisionMissionValues'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import GetAQuoteBanner from '@/components/public/home/GetAQuoteBanner'
import ContactSection from '@/components/public/home/ContactSection'
import { getHeroSlides, getServices, getTestimonials,getSiteSettings } from '@/lib/data/fetchers'
import MapSection from '@/components/public/shared/MapSection'

export default async function HomePage() {
  const [slides, services, testimonials,settings] = await Promise.all([
    getHeroSlides(),
    getServices(),
    getTestimonials(),
    getSiteSettings(),
  ])

  return (
    <>
      <HeroSlider slides={slides} />
      <StatsBar />
      <ServicesGrid services={services} />
      <AboutSection />
      <VisionMissionValues />
      <WhyChooseUs />
      <Testimonials testimonials={testimonials} />
      <GetAQuoteBanner settings={settings} />
      <ContactSection settings={settings} />
      <MapSection settings={settings} hideLeftpanel/>
    </>
  )
}
