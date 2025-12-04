"use client";

import { motion } from "framer-motion";
import Button from "../Button";

interface AboutSectionProps {
  variant?: "teaser" | "full";
}

export default function AboutSection({ variant = "full" }: AboutSectionProps) {
  const features = [
    {
      title: "Student-led & local",
      description: "Chapters choose causes and partners locally, building leadership and community.",
      icon: "🎓",
    },
    {
      title: "Transparent impact",
      description: "We set clear goals each term and publish results so supporters can follow along.",
      icon: "📊",
    },
    {
      title: "Hands-on volunteering",
      description: "Members take action through drives, events, and collabs with local orgs.",
      icon: "🤝",
    },
    {
      title: "Open to everyone",
      description: "No experience needed—just energy to help. Training and mentorship provided.",
      icon: "🌟",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (variant === "teaser") {
    return (
      <section className="py-20 bg-gradient-to-br from-white to-eo-bg/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Left: Title + Intro */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-eo-teal/10 rounded-full">
                <span className="text-2xl" aria-hidden="true">
                  💙
                </span>
                <span className="text-sm font-semibold text-eo-teal tracking-wide">
                  About Us
                </span>
              </div>
              <h2 className="font-brand text-4xl lg:text-5xl font-bold text-eo-dark leading-tight">
                Why Empower Orphans exists
              </h2>
              <p className="mt-6 text-lg text-eo-dark/80 leading-relaxed">
                We mobilize students to raise funds, advocate and volunteer so orphaned children get food, school, and care.
              </p>
              <div className="mt-8">
                <Button href="/about" size="lg">
                  Learn More About Us
                </Button>
              </div>
            </motion.div>

            {/* Right: Feature Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="rounded-2xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-6 
                           shadow-lg hover:shadow-brand transition-all card-hover"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-eo-dark font-brand mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-eo-dark/70 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Full version for /about page
  return (
    <section className="py-20 bg-gradient-to-br from-white to-eo-bg/30">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-eo-teal/10 rounded-full">
            <span className="text-2xl" aria-hidden="true">
              💙
            </span>
            <span className="text-sm font-semibold text-eo-teal tracking-wide">
              About Us
            </span>
          </div>
          <h1 className="font-brand text-5xl lg:text-6xl font-bold text-eo-dark leading-tight mb-6">
            About Empower Orphans
          </h1>
          <p className="text-xl text-eo-dark/80 leading-relaxed max-w-4xl mx-auto">
            <strong>Empower Orphans</strong> is a student-led nonprofit dedicated to mobilizing university chapters 
            to raise funds, advocate, and volunteer—ensuring orphaned and vulnerable children 
            receive the food, education, and care they deserve.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-eo-dark font-brand mb-4">Our Mission</h2>
            <p className="text-lg text-eo-dark/80 leading-relaxed">
              To mobilize students across Canada to fundraise, volunteer, and advocate for orphaned 
              children worldwide. We believe young people can drive meaningful change when given the 
              tools, community, and purpose.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-eo-dark font-brand mb-4">Our Vision</h2>
            <p className="text-lg text-eo-dark/80 leading-relaxed">
              A world where every orphaned child has access to the essentials—food, shelter, education, 
              and love—supported by a generation of compassionate student leaders who refuse to look away.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="rounded-2xl border border-eo-blue/20 bg-white/80 backdrop-blur-sm p-6 
                       shadow-lg hover:shadow-brand transition-all card-hover"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-eo-dark font-brand mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-eo-dark/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="rounded-3xl border border-eo-blue/20 bg-gradient-to-br from-eo-teal/5 to-eo-blue/5 p-12">
            <h2 className="font-brand text-3xl lg:text-4xl font-bold text-eo-dark mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-eo-dark/80 mb-8 max-w-2xl mx-auto">
              Join one of our chapters or start your own. Together, we can create lasting impact 
              for children who need it most.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/chapters" size="lg" variant="primary">
                Join a Chapter
              </Button>
              <Button href="/donate" size="lg" variant="outline">
                Support Our Mission
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

