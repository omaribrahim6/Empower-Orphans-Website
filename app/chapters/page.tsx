import { Metadata } from "next";
import ChaptersSection from "@/components/sections/ChaptersSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chapters | Empower Orphans",
  description: "Join our university chapters at Carleton or uOttawa. No experience needed—just energy and heart to help orphaned children.",
  openGraph: {
    title: "Chapters | Empower Orphans",
    description: "Join our student-led chapters making a difference for orphaned children",
    type: "website",
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

