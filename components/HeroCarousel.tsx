"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Button from "./Button";

type HeroImage = {
  id: string;
  url: string;
  alt?: string;
  position?: number;
};

type Props = {
  images: HeroImage[];
};

export default function HeroCarousel({ images }: Props) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper function to handle smooth transitions
  const transitionToIndex = (newIndex: number | ((prevIndex: number) => number)) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIdx(newIndex);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  useEffect(() => {
    if (paused || images.length <= 1) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      transitionToIndex((i) => (i + 1) % images.length);
    }, 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, images.length]);

  // Fallback if no images
  if (images.length === 0) {
    return (
      <section
        className="relative w-full h-[85vh] grid place-items-center bg-gradient-to-br from-eo-teal via-eo-blue to-eo-sky"
        id="top"
      >
        <div className="text-center px-6 max-w-4xl animate-fade-in">
          <h1 className="font-brand text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
            <span className="block">Empower Orphans</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 font-medium text-white/95">Student-led. Impact-driven.</span>
          </h1>
          <p className="mt-6 text-xl text-white/95 leading-relaxed">
            Join our campus chapters raising funds and volunteering so orphaned children receive food, school, and care.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/donate" variant="primary" size="lg">
              Donate Now
            </Button>
            <Button href="/chapters" variant="outline-hero" size="lg">
              Join a Chapter
            </Button>
          </div>
        </div>
        
        {/* Animated shapes in background */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
      </section>
    );
  }

  return (
    <>
      <section
        id="top"
        className="relative w-full h-[85vh] overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Homepage hero carousel"
      >
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 z-[1] hero-scrim pointer-events-none" />

        {/* Image Slides */}
        <div className={`absolute inset-0 transition-all duration-500 ${isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100'}`}>
          <Image
            key={images[idx].id}
            src={images[idx].url}
            alt={images[idx].alt || "Hero slide"}
            fill
            priority={idx === 0}
            loading={idx === 0 ? "eager" : "lazy"}
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover"
            style={{
              objectPosition: `center ${images[idx].position ?? 50}%`
            }}
          />
        </div>

        {/* Content - simple centered layout */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-4xl rounded-2xl sm:rounded-3xl backdrop-blur-lg bg-white/15 border border-white/20 
                       px-5 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 text-center shadow-2xl animate-fade-in">
            <h1 className="font-brand text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              <span className="block">Empower Orphans</span>
              <span className="block text-base sm:text-2xl md:text-3xl lg:text-4xl mt-1 sm:mt-2 font-medium text-white/95">Student-led. Impact-driven.</span>
            </h1>
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg md:text-xl text-white/95 leading-relaxed">
              University chapters raising funds and volunteering so orphaned children receive food, education, and care.
            </p>
            <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Button href="/donate" variant="primary" size="lg">
                Donate Now
              </Button>
              <Button href="/chapters" variant="outline-hero" size="lg">
                Join a Chapter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Controls - below the hero (only if multiple images) */}
      {images.length > 1 && (
        <div className="py-4 flex items-center justify-center gap-4">
          {/* Previous Button */}
          <button
            className="rounded-full bg-eo-teal hover:bg-eo-blue w-10 h-10 flex items-center justify-center text-xl text-white transition-all shadow-md"
            aria-label="Previous slide"
            onClick={() => transitionToIndex((i) => (i - 1 + images.length) % images.length)}
          >
            ‹
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2.5">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => transitionToIndex(i)}
                className={`h-3 w-3 rounded-full transition-all ${
                  i === idx
                    ? "bg-eo-teal shadow-lg w-8"
                    : "bg-eo-sky/60 hover:bg-eo-blue"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            className="rounded-full bg-eo-teal hover:bg-eo-blue w-10 h-10 flex items-center justify-center text-xl text-white transition-all shadow-md"
            aria-label="Next slide"
            onClick={() => transitionToIndex((i) => (i + 1) % images.length)}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

