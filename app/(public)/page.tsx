import HeroSlider from "@/components/public/home/HeroSlider";
import StatsBar from "@/components/public/home/StatsBar";
import ServicesGrid from "@/components/public/home/ServicesGrid";
import AboutSection from "@/components/public/home/AboutSection";
import VisionMissionValues from "@/components/public/home/VisionMissionValues";
import WhyChooseUs from "@/components/public/home/WhyChooseUs";
import Testimonials from "@/components/public/home/Testimonials";
import GetAQuoteBanner from "@/components/public/home/GetAQuoteBanner";
import ContactSection from "@/components/public/home/ContactSection";
import {
  getHeroSlides,
  getServices,
  getTestimonials,
} from "@/lib/data/fetchers";

export default async function HomePage() {
  const [slides, services, testimonials] = await Promise.all([
    getHeroSlides(),
    getServices(),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />
      <StatsBar />
      <ServicesGrid services={services} />
      <AboutSection />
      <VisionMissionValues />
      <WhyChooseUs />
      <Testimonials testimonials={testimonials} />
      <GetAQuoteBanner />
      <ContactSection />
    </>
  );
}
