import HeroSlider from '@/components/public/home/HeroSlider'
import StatsBar from '@/components/public/home/StatsBar'
import ServicesGrid from '@/components/public/home/ServicesGrid'
import AboutSection from '@/components/public/home/AboutSection'
import VisionMissionValues from '@/components/public/home/VisionMissionValues'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import GetAQuoteBanner from '@/components/public/home/GetAQuoteBanner'
import ContactSection from '@/components/public/home/ContactSection'
import { getHeroSlides, getServices, getTestimonials, getSiteSettings, getBanners } from '@/lib/data/fetchers'
import MapSection from '@/components/public/shared/MapSection'
import ConfigurableBanner from '@/components/public/shared/ConfigurableBanner'
import { getBannerForPlacement } from '@/lib/utils/banners'

export default async function HomePage() {
  const [slides, services, testimonials, settings, banners] = await Promise.all([
    getHeroSlides(),
    getServices(),
    getTestimonials(),
    getSiteSettings(),
    getBanners(),
  ])

  const homeAfterServicesBanner = getBannerForPlacement(banners, 'home_after_services')
  const homeAfterAboutBanner = getBannerForPlacement(banners, 'home_after_about')
  const homeBeforeContactBanner = getBannerForPlacement(banners, 'home_before_contact')

  return (
    <>
      <HeroSlider slides={slides} />
      <StatsBar />
      <ServicesGrid services={services} />
      {homeAfterServicesBanner ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ConfigurableBanner banner={homeAfterServicesBanner} />
        </div>
      ) : null}
      <AboutSection />
      {homeAfterAboutBanner ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <ConfigurableBanner banner={homeAfterAboutBanner} />
        </div>
      ) : null}
      <VisionMissionValues />
      <WhyChooseUs />
      <Testimonials testimonials={testimonials} />
      <GetAQuoteBanner settings={settings} />
      {homeBeforeContactBanner ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ConfigurableBanner banner={homeBeforeContactBanner} />
        </div>
      ) : null}
      <ContactSection settings={settings} />
      <MapSection settings={settings} hideLeftpanel/>
    </>
  )
}
