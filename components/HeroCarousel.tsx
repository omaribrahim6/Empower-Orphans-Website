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
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
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
            Empowering orphans, led by students.
          </h1>
          <p className="mt-6 text-xl text-white/95 leading-relaxed">
            Join our campus chapters raising funds and volunteering so orphaned children receive food, school, and care.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/donate" variant="primary" size="lg">
              Donate Now
            </Button>
            <Button href="/chapters" variant="outline" size="lg">
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
      <div className="absolute inset-0 hero-image-transition">
        <Image
          key={images[idx].id}
          src={images[idx].url}
          alt={images[idx].alt || "Hero slide"}
          fill
          priority={idx === 0}
          loading={idx === 0 ? "eager" : "lazy"}
          quality={80}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover transition-opacity duration-1000"
          style={{
            objectPosition: `center ${images[idx].position ?? 50}%`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl rounded-3xl backdrop-blur-lg bg-white/15 border border-white/20 
                     px-8 md:px-12 py-10 text-center shadow-2xl animate-fade-in">
          <h1 className="font-brand text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            Empowering orphans, led by students.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/95 leading-relaxed">
            Join our campus chapters raising funds and volunteering so orphaned children receive food, school, and care.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/donate" variant="primary" size="lg">
              Donate Now
            </Button>
            <Button href="/chapters" variant="outline" size="lg">
              Join a Chapter
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Controls (only if multiple images) */}
      {images.length > 1 && (
        <>
          {/* Bottom Navigation Controls with Dots */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-20 px-4">
            {/* Previous Button */}
            <button
              className="rounded-full bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center text-xl text-white border border-white/30 hover:bg-white/30 transition-all flex-shrink-0"
              aria-label="Previous slide"
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            >
              ‹
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    i === idx
                      ? "bg-white shadow-lg w-8"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              className="rounded-full bg-white/20 backdrop-blur-md w-10 h-10 flex items-center justify-center text-xl text-white border border-white/30 hover:bg-white/30 transition-all flex-shrink-0"
              aria-label="Next slide"
              onClick={() => setIdx((i) => (i + 1) % images.length)}
            >
              ›
            </button>
          </div>
        </>
      )}
    </section>
  );
}

