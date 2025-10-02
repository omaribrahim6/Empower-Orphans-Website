"use client";

import { motion } from "framer-motion";
import { SITE, DONATIONS } from "@/lib/config";
import Button from "../Button";

interface DonateSectionProps {
  variant?: "teaser" | "full";
}

export default function DonateSection({ variant = "full" }: DonateSectionProps) {
  // Get current donations from env or use placeholder
  const envCurrent = process.env.NEXT_PUBLIC_CURRENT_DONATIONS 
    ? Number(process.env.NEXT_PUBLIC_CURRENT_DONATIONS) 
    : DONATIONS.placeholderCurrent;
  
  const current = Math.max(0, Math.min(envCurrent, SITE.goalThisYear));
  const goal = SITE.goalThisYear;
  const pct = Math.max(0, Math.min(100, (current / goal) * 100));
  const remaining = Math.max(0, goal - current);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: DONATIONS.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (variant === "teaser") {
    return (
      <section className="py-20 bg-gradient-to-br from-eo-bg/20 via-white to-eo-sky/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Left: Copy + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-eo-teal/10 rounded-full">
                <span className="text-2xl" aria-hidden="true">
                  🎯
                </span>
                <span className="text-sm font-semibold text-eo-teal tracking-wide">
                  Make an Impact
                </span>
              </div>
              <h2 className="font-brand text-4xl lg:text-5xl font-bold text-eo-dark leading-tight">
                Help Us Reach Our Goal
              </h2>
              <p className="mt-6 text-lg text-eo-dark/80 leading-relaxed">
                We're working toward <span className="font-bold text-eo-teal">{formatCurrency(goal)}</span> this year. 
                Every contribution supports food, education, and shelter for orphaned children.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/donate" size="lg" variant="primary">
                  Learn More
                </Button>
                <Button href="/chapters" size="lg" variant="outline">
                  Join Us
                </Button>
              </div>
            </motion.div>

            {/* Right: Progress UI */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
                <div className="flex items-end justify-between gap-6 mb-6">
                  <div>
                    <p className="text-sm text-eo-dark/60 font-medium mb-1">Raised So Far</p>
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-3xl md:text-4xl font-bold text-eo-teal font-brand"
                    >
                      {formatCurrency(current)}
                    </motion.p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-eo-dark/60 font-medium mb-1">Goal</p>
                    <p className="text-2xl md:text-3xl font-bold text-eo-dark font-brand">
                      {formatCurrency(goal)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-5 overflow-hidden rounded-full bg-eo-blue/15 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: "linear-gradient(90deg, #0e869d 0%, #45bfd6 60%, #79d3ff 100%)",
                        boxShadow: "0 4px 16px rgba(14, 134, 157, 0.3)",
                      }}
                    >
                      {/* Animated shimmer effect */}
                      <motion.div
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="rounded-xl bg-gradient-to-br from-eo-teal/10 to-eo-blue/10 p-5"
                  >
                    <p className="text-xs text-eo-dark/60 font-medium mb-1">Progress</p>
                    <p className="text-2xl md:text-3xl font-bold text-eo-teal font-brand">
                      {Math.floor(pct)}%
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="rounded-xl bg-gradient-to-br from-eo-sky/10 to-eo-blue/10 p-5"
                  >
                    <p className="text-xs text-eo-dark/60 font-medium mb-1">Remaining</p>
                    <p className="text-2xl md:text-3xl font-bold text-eo-dark font-brand">
                      {formatCurrency(remaining)}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Full version for /donate page
  return (
    <section className="py-20 bg-gradient-to-br from-eo-bg/20 via-white to-eo-sky/10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-eo-teal/10 rounded-full">
            <span className="text-2xl" aria-hidden="true">
              🎯
            </span>
            <span className="text-sm font-semibold text-eo-teal tracking-wide">
              Make an Impact
            </span>
          </div>
          <h1 className="font-brand text-5xl lg:text-6xl font-bold text-eo-dark leading-tight mb-6">
            Every Dollar Changes Lives
          </h1>
          <p className="text-xl text-eo-dark/80 leading-relaxed max-w-4xl mx-auto">
            Your donation directly supports food, education, healthcare, and shelter for orphaned children. 
            100% of your contribution goes toward programs that change lives.
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-10 shadow-xl">
            <h2 className="font-brand text-3xl font-bold text-eo-dark mb-8 text-center">
              Our {new Date().getFullYear()} Goal
            </h2>
            
            <div className="flex items-end justify-between gap-6 mb-6">
              <div>
                <p className="text-sm text-eo-dark/60 font-medium mb-1">Raised So Far</p>
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-eo-teal font-brand"
                >
                  {formatCurrency(current)}
                </motion.p>
              </div>
              <div className="text-right">
                <p className="text-sm text-eo-dark/60 font-medium mb-1">Goal</p>
                <p className="text-3xl md:text-4xl font-bold text-eo-dark font-brand">
                  {formatCurrency(goal)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="h-6 overflow-hidden rounded-full bg-eo-blue/15 relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: "linear-gradient(90deg, #0e869d 0%, #45bfd6 60%, #79d3ff 100%)",
                    boxShadow: "0 4px 16px rgba(14, 134, 157, 0.3)",
                  }}
                >
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="rounded-xl bg-gradient-to-br from-eo-teal/10 to-eo-blue/10 p-6 text-center"
              >
                <p className="text-sm text-eo-dark/60 font-medium mb-2">Progress</p>
                <p className="text-4xl font-bold text-eo-teal font-brand">
                  {Math.floor(pct)}%
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="rounded-xl bg-gradient-to-br from-eo-sky/10 to-eo-blue/10 p-6 text-center"
              >
                <p className="text-sm text-eo-dark/60 font-medium mb-2">Remaining</p>
                <p className="text-4xl font-bold text-eo-dark font-brand">
                  {formatCurrency(remaining)}
                </p>
              </motion.div>
            </div>

            <div className="text-center">
              <Button href={SITE.links.donate} size="lg" variant="primary">
                Donate Now
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { amount: "$25", impact: "Provides a week of nutritious meals for one child" },
            { amount: "$100", impact: "Covers school supplies and uniforms for a semester" },
            { amount: "$500", impact: "Funds healthcare and medical care for a family" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-2xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-8 shadow-lg text-center"
            >
              <p className="text-3xl font-bold text-eo-teal font-brand mb-4">{item.amount}</p>
              <p className="text-eo-dark/80 leading-relaxed">{item.impact}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="rounded-3xl border border-eo-blue/20 bg-gradient-to-br from-eo-teal/5 to-eo-blue/5 p-12">
            <h2 className="font-brand text-3xl lg:text-4xl font-bold text-eo-dark mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-eo-dark/80 mb-8 max-w-2xl mx-auto">
              Your gift moves us closer to helping more children in need. Every contribution matters.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href={SITE.links.donate} size="lg" variant="primary">
                Donate Today
              </Button>
              <Button href="/chapters" size="lg" variant="outline">
                Join a Chapter
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

