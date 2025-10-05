"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <div className="text-center px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-brand text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg"
          >
            Empowering orphans, led by students.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-xl text-white/95 leading-relaxed"
          >
            Join our campus chapters raising funds and volunteering so orphaned children receive food, school, and care.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button href="/donate" variant="primary" size="lg">
              Donate Now
            </Button>
            <Button href="/chapters" variant="outline" size="lg">
              Join a Chapter
            </Button>
          </motion.div>
        </div>
        
        {/* Animated shapes in background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
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
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={images[idx].id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src={images[idx].url}
            alt={images[idx].alt || "Hero slide"}
            className="h-full w-full object-cover"
            style={{
              objectPosition: `center ${images[idx].position ?? 50}%`
            }}
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-4xl rounded-3xl backdrop-blur-lg bg-white/15 border border-white/20 
                     px-8 md:px-12 py-10 text-center shadow-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-brand text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg"
          >
            Empowering orphans, led by students.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-5 text-lg md:text-xl text-white/95 leading-relaxed"
          >
            Join our campus chapters raising funds and volunteering so orphaned children receive food, school, and care.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button href="/donate" variant="primary" size="lg">
              Donate Now
            </Button>
            <Button href="/chapters" variant="outline" size="lg">
              Join a Chapter
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Controls (only if multiple images) */}
      {images.length > 1 && (
        <>
          <button
            className="hero-nav left-4 z-20"
            aria-label="Previous slide"
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
          >
            ‹
          </button>
          <button
            className="hero-nav right-4 z-20"
            aria-label="Next slide"
            onClick={() => setIdx((i) => (i + 1) % images.length)}
          >
            ›
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2.5 z-20">
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
        </>
      )}
    </section>
  );
}

