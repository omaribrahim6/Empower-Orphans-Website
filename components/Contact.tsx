"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/config";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic with proper sanitization
    alert("Form submission will be implemented when backend is ready!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Basic input sanitization
    const value = e.target.value.replace(/<[^>]*>/g, ""); // Strip HTML tags
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-white to-eo-bg/20">
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
              📧
            </span>
            <span className="text-sm font-semibold text-eo-teal tracking-wide">
              Get In Touch
            </span>
          </div>
          <h2 className="font-brand text-4xl lg:text-5xl font-bold text-eo-dark">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-eo-dark/70 max-w-2xl mx-auto">
            Reach out with partnerships, volunteering, or press inquiries. We'll get back quickly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-eo-dark font-brand mb-6">
              Our Chapters
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-eo-dark mb-2">Carleton University</h4>
                <a
                  href={SITE.instagram.carleton}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-eo-teal hover:text-eo-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @empowerorphans_carleton
                </a>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-eo-dark mb-2">University of Ottawa</h4>
                <a
                  href={SITE.instagram.uottawa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-eo-teal hover:text-eo-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @empowerorphans_uottawa
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-eo-blue/20">
              <h4 className="text-lg font-semibold text-eo-dark mb-3">Email</h4>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="flex items-center gap-2 text-eo-teal hover:text-eo-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {SITE.contactEmail}
              </a>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-eo-dark font-brand mb-6">
                Send us a message
              </h3>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-eo-dark mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-eo-blue/30 bg-white px-4 py-3 
                             text-eo-dark placeholder:text-eo-dark/40 
                             focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent
                             transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-eo-dark mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-eo-blue/30 bg-white px-4 py-3 
                             text-eo-dark placeholder:text-eo-dark/40 
                             focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent
                             transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-eo-dark mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-xl border border-eo-blue/30 bg-white px-4 py-3 
                             text-eo-dark placeholder:text-eo-dark/40 
                             focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent
                             transition-all resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-pill bg-eo-teal text-white px-6 py-4 text-base font-semibold 
                           hover:brightness-110 transition-all btn-glow"
                >
                  Send Message
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

