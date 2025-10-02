import { Metadata } from "next";
import DonateSection from "@/components/sections/DonateSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Donate | Empower Orphans",
  description: "Your donation directly supports food, education, healthcare, and shelter for orphaned children. Every dollar changes lives.",
  openGraph: {
    title: "Donate | Empower Orphans",
    description: "Support orphaned children through our student-led fundraising campaigns",
    type: "website",
  },
};

export default function DonatePage() {
  return (
    <>
      <main className="pt-24">
        <DonateSection variant="full" />
      </main>
      <Footer />
    </>
  );
}
