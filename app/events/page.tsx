import { Metadata } from "next";
import EventsClient from "@/components/EventsClient";
import Footer from "@/components/Footer";
import { getEvents } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Events & Programs | Empower Orphans",
  description: "Discover our upcoming and past events - from fundraising campaigns to volunteer drives.",
};

export default async function EventsPage() {
  // Fetch events server-side for better SEO and performance
  const events = await getEvents();

  const upcomingEvents = events.filter(e => !e.is_past);
  const pastEvents = events.filter(e => e.is_past);

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="pt-44 pb-20 bg-gradient-to-br from-eo-teal via-eo-blue to-eo-sky text-white">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h1 className="font-brand text-5xl lg:text-6xl font-bold mb-6">
              Events & Programs
            </h1>
            <p className="text-xl lg:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto">
              From fundraising campaigns to volunteer drives, our student teams run initiatives year-round.
            </p>
          </div>
        </section>

        <EventsClient upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
      </main>
      <Footer />
    </>
  );
}

