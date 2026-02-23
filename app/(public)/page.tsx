// import HeroSlider from "@/components/public/home/HeroSlider";
// import ServicesGrid from "@/components/public/home/ServicesGrid";
// import VisionMissionValues from "@/components/public/home/VisionMissionValues";
// import AboutSection from "@/components/public/home/AboutSection";
// import Testimonials from "@/components/public/home/Testimonials";
// import ContactSection from "@/components/public/home/ContactSection";

// export default function Home() {
//   return (
//     <div>
//       <HeroSlider />
//       <ServicesGrid />
//       <VisionMissionValues />
//       <AboutSection />
//       <Testimonials />
//       <ContactSection />
//     </div>
//   );
// }

import ContactSection from "@/components/public/home/ContactSection";
import GetAQuoteBanner from "@/components/public/home/GetAQuoteBanner";
import HeroSlider from "@/components/public/home/HeroSlider";
import ServicesGrid from "@/components/public/home/ServicesGrid";
import StatsBar from "@/components/public/home/StatsBar";
import Testimonials from "@/components/public/home/Testimonials";
import VisionMissionValues from "@/components/public/home/VisionMissionValues";
import WhyChooseUs from "@/components/public/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsBar />
      <ServicesGrid />
      <VisionMissionValues />
      <WhyChooseUs />
      <Testimonials />
      <GetAQuoteBanner />
      <ContactSection />
    </>
  );
}
