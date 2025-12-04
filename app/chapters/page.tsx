import { Metadata } from "next";
import ChaptersSection from "@/components/sections/ChaptersSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chapters",
  description: "Join Empower Orphans student chapters at Carleton University or University of Ottawa (uOttawa). No experience needed—just energy and heart to help orphaned children.",
  keywords: ["Empower Orphans chapters", "Carleton charity club", "uOttawa volunteer", "student nonprofit Ottawa", "university charity organization"],
  openGraph: {
    title: "Chapters | Empower Orphans",
    description: "Join our student-led chapters at Carleton and uOttawa. Make a difference for orphaned children today!",
    type: "website",
  },
  alternates: {
    canonical: "/chapters",
  },
};

export default function ChaptersPage() {
  return (
    <>
      <main className="pt-24">
        <ChaptersSection variant="full" />
      </main>
      <Footer />
    </>
  );
}

