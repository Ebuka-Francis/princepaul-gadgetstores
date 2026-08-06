"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/banner1.png",
    mobileImage: "/mobilebanner1.png", // Add your mobile image path here
    alt: "Unbox the Extraordinary - Premium Gadgets",
  },
  {
    id: 2,
    image: "/banner2.png",
    mobileImage: "/mobilebanner2.png",
    alt: "Special Deals on Laptops and Accessories",
  },
  {
    id: 3,
    image: "/banner3.png",
    mobileImage: "/mobilebanner3.png",
    alt: "New iPhone & Gaming Console Arrivals",
  },
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback((api: typeof emblaApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full space-y-3 pt-3 lg:pt-0">
      
      {/* 1. Mobile-Only Search Input (Matches Mobile Mockup Top Card) */}
      <div className="block lg:hidden w-full">
        <div className="flex h-11 items-center overflow-hidden rounded-xl border border-gray-200 bg-transparent px-3 shadow-sm focus-within:border-primary">
          <input
            className="w-full text-xs  text-gray-800 outline-none placeholder:text-gray-400"
            placeholder="Search for gadgets, brands..."
          />
          <button className="text-primary p-1">
            <Search className="text-white" size={18} />
          </button>
        </div>
      </div>

      {/* 2. Responsive Hero Banner Slider */}
      <div className="relative w-full overflow-hidden rounded-2xl group">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="relative min-w-0 flex-[0_0_100%] aspect-[4/5] sm:aspect-[16/8] md:aspect-[16/5] min-h-[340px] max-h-[500px]"
              >
                {/* Mobile Image (< md) */}
                <Image
                  src={slide.mobileImage || slide.image}
                  alt={slide.alt}
                  fill
                  priority={slide.id === 1}
                  className="object-cover md:hidden"
                />

                {/* Desktop Image (>= md) */}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={slide.id === 1}
                  className="object-cover hidden md:block"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (Hidden on Mobile, Visible on Desktop Hover) */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={scrollNext}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}