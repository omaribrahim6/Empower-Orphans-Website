"use client";

import { motion } from "framer-motion";
import { Event } from "@/lib/supabase";
import { SITE } from "@/lib/config";

type Props = {
  upcomingEvents: Event[];
  pastEvents: Event[];
};

export default function EventsClient({ upcomingEvents, pastEvents }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const EventCard = ({ event }: { event: Event }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="rounded-3xl border border-eo-blue/20 bg-white overflow-hidden shadow-lg 
               hover:shadow-brand transition-all"
    >
      {event.image_url && (
        <div className="relative h-48 bg-gradient-to-br from-eo-bg to-eo-sky overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-eo-teal/10 text-eo-teal text-xs font-semibold rounded-full">
            {formatDate(event.date)}
          </span>
          {event.chapter && (
            <span className="px-3 py-1 bg-eo-blue/10 text-eo-blue text-xs font-semibold rounded-full capitalize">
              {event.chapter}
            </span>
          )}
        </div>
        <h3 className="font-brand text-2xl font-bold text-eo-dark mb-3">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-eo-dark/70 leading-relaxed mb-4">
            {event.description}
          </p>
        )}
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-eo-dark/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-brand text-4xl font-bold text-eo-dark mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-eo-dark/70">
              Join us at our next event and make a difference!
            </p>
          </motion.div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16 rounded-3xl border border-eo-blue/20 bg-eo-bg/10"
            >
              <div className="text-6xl mb-4">📅</div>
              <h3 className="font-brand text-2xl font-bold text-eo-dark mb-3">
                No Upcoming Events Yet
              </h3>
              <p className="text-eo-dark/70 mb-6 max-w-lg mx-auto">
                Follow us on Instagram or join our WhatsApp community to hear about the next one!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href={SITE.instagram.carleton}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill bg-eo-teal text-white px-6 py-3 font-semibold hover:brightness-110 transition-all"
                >
                  Follow Carleton
                </a>
                <a
                  href={SITE.instagram.uottawa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill bg-eo-blue text-white px-6 py-3 font-semibold hover:brightness-110 transition-all"
                >
                  Follow uOttawa
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-eo-bg/20 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="font-brand text-4xl font-bold text-eo-dark mb-4">
                Past Events
              </h2>
              <p className="text-lg text-eo-dark/70">
                Take a look at what we've accomplished together.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

