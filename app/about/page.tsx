import { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | Empower Orphans",
  description: "Learn about our mission to mobilize students to raise funds, advocate, and volunteer for orphaned children worldwide.",
  openGraph: {
    title: "About Us | Empower Orphans",
    description: "Student-led nonprofit dedicated to helping orphaned children through fundraising and volunteering",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <main className="pt-24">
        <AboutSection variant="full" />
      </main>
      <Footer />
    </>
  );
}
