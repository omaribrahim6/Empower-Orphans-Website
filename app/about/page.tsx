import { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Empower Orphans - our mission to mobilize students to raise funds, advocate, and volunteer for orphaned and vulnerable children worldwide. Student chapters at Carleton and uOttawa.",
  keywords: ["Empower Orphans about", "student nonprofit mission", "orphan charity Canada", "volunteer organization Ottawa"],
  openGraph: {
    title: "About Us | Empower Orphans",
    description: "Discover our mission to support orphaned children through student-led fundraising and volunteering at Carleton and uOttawa.",
    type: "website",
  },
  alternates: {
    canonical: "/about",
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
