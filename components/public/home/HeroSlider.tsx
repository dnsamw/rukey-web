"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import CTAButton from "@/components/public/shared/CTAButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/types/hero";

type Props = { slides: HeroSlide[] };

export default function HeroSlider({ slides }: Props) {
  console.log("Slides", slides);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!slides?.length) return null;

  return (
    <section className="relative w-full h-[90vh] min-h-[580px] overflow-hidden">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full">
              <Image
                src={slide.image_url}
                alt={`${slide.title} ${slide.subtitle}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F]/85 via-[#1E3A5F]/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <span className="inline-block bg-[#F97316] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
                      Professional Service
                    </span>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-2">
                      {slide.title}
                    </h1>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F97316] leading-none mb-6">
                      {slide.subtitle}
                    </h2>
                    <p className="text-gray-200 text-lg leading-relaxed mb-8 max-w-md">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <CTAButton href="/get-a-quote">
                        Get a Free Quote
                      </CTAButton>
                      <CTAButton href="/services" variant="outline">
                        Our Services
                      </CTAButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/20 hover:bg-[#F97316] backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/20 hover:bg-[#F97316] backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`transition-all duration-300 rounded-full ${i === selectedIndex ? "w-8 h-2.5 bg-[#F97316]" : "w-2.5 h-2.5 bg-white/50 hover:bg-white"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="absolute bottom-6 right-8 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs uppercase tracking-widest rotate-90 mb-2">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
