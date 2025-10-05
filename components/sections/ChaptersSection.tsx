"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/config";
import Button from "../Button";

interface ChaptersSectionProps {
  variant?: "teaser" | "full";
}

export default function ChaptersSection({ variant = "full" }: ChaptersSectionProps) {
  const chapters = [
    {
      name: "Carleton University",
      description: "Volunteer, run fundraisers, and grow impact at Carleton.",
      applyLink: SITE.links.joinCarleton,
      instagramLink: SITE.instagram.carleton,
      color: "from-eo-teal to-eo-blue",
    },
    {
      name: "University of Ottawa",
      description: "Join students at uOttawa driving year-round initiatives.",
      applyLink: SITE.links.joinUOttawa,
      instagramLink: SITE.instagram.uottawa,
      color: "from-eo-blue to-eo-sky",
    },
  ];

  if (variant === "teaser") {
    return (
      <section id="join" className="py-20 bg-gradient-to-br from-eo-bg/30 via-white to-eo-sky/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-eo-teal/10 rounded-full">
              <span className="text-2xl" aria-hidden="true">
                🎉
              </span>
              <span className="text-sm font-semibold text-eo-teal tracking-wide">
                Get Involved
              </span>
            </div>
            <h2 className="font-brand text-4xl lg:text-5xl font-bold text-eo-dark">
              Join a Chapter
            </h2>
            <p className="mt-4 text-lg text-eo-dark/70 max-w-2xl mx-auto">
              Pick your campus chapter and apply for membership. No experience needed—just energy to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {chapters.map((chapter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="group rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm 
                         p-8 shadow-xl hover:shadow-2xl transition-all card-hover relative overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-0 
                            group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-eo-dark font-brand mb-3">
                    {chapter.name}
                  </h3>
                  <p className="text-eo-dark/70 leading-relaxed mb-6">
                    {chapter.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button href={chapter.applyLink} variant="primary">
                      Apply Now
                    </Button>
                    <Button href={chapter.instagramLink} variant="outline">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </Button>
                  </div>

                  {/* Decorative icon */}
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-6 right-6 text-6xl opacity-10 group-hover:opacity-20 transition-opacity"
                  >
                    🎓
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-eo-dark/70 mb-4">
              Want to start a chapter at your university?
            </p>
            <a
              href={`mailto:${SITE.contactEmail}?subject=New Chapter Inquiry`}
              className="inline-flex items-center gap-2 text-eo-teal hover:text-eo-dark transition-colors font-semibold"
            >
              Contact us
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  // Full version for /chapters page
  return (
    <section className="py-20 bg-gradient-to-br from-eo-bg/30 via-white to-eo-sky/20">
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
              🎉
            </span>
            <span className="text-sm font-semibold text-eo-teal tracking-wide">
              Get Involved
            </span>
          </div>
          <h1 className="font-brand text-5xl lg:text-6xl font-bold text-eo-dark leading-tight mb-6">
            Join a Chapter, Change Lives
          </h1>
          <p className="text-xl text-eo-dark/80 leading-relaxed max-w-4xl mx-auto">
            Our university chapters are the heart of Empower Orphans. Led by passionate students, 
            each chapter organizes fundraisers, volunteer drives, and awareness campaigns to support 
            orphaned children. No experience needed—just energy and heart.
          </p>
        </motion.div>

        {/* Chapter Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto mb-16">
          {chapters.map((chapter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm 
                       p-10 shadow-xl hover:shadow-2xl transition-all card-hover relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-0 
                          group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-eo-dark font-brand mb-4">
                  {chapter.name}
                </h2>
                <p className="text-lg text-eo-dark/70 leading-relaxed mb-8">
                  {chapter.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button href={chapter.applyLink} variant="primary" size="lg">
                    Apply Now
                  </Button>
                  <Button href={chapter.instagramLink} variant="outline" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Follow Us
                  </Button>
                </div>

                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-8 right-8 text-7xl opacity-10 group-hover:opacity-20 transition-opacity"
                >
                  🎓
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Join Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-brand text-4xl font-bold text-eo-dark text-center mb-12">
            Why Join a Chapter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💪",
                title: "Build Leadership Skills",
                description: "Lead campaigns, manage teams, and develop real-world nonprofit experience.",
              },
              {
                icon: "🤝",
                title: "Make Real Impact",
                description: "Every dollar raised and hour volunteered directly helps children in need.",
              },
              {
                icon: "🌟",
                title: "Join a Community",
                description: "Connect with like-minded students who share your passion for social good.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-8 shadow-lg text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-eo-dark font-brand mb-3">
                  {item.title}
                </h3>
                <p className="text-eo-dark/70 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start a Chapter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="rounded-3xl border border-eo-blue/20 bg-gradient-to-br from-eo-teal/5 to-eo-blue/5 p-12">
            <h2 className="font-brand text-3xl lg:text-4xl font-bold text-eo-dark mb-6">
              Want to Start a Chapter at Your University?
            </h2>
            <p className="text-lg text-eo-dark/80 mb-8 max-w-2xl mx-auto">
              We're expanding to new campuses! If you're passionate about helping orphaned children 
              and want to bring Empower Orphans to your school, we'd love to hear from you.
            </p>
            <a
              href={`mailto:${SITE.contactEmail}?subject=New Chapter Inquiry`}
              className="inline-flex items-center gap-2 btn-pill bg-eo-teal text-white px-8 py-4 text-lg font-semibold 
                       hover:brightness-110 transition-all btn-glow"
            >
              Contact Us
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

