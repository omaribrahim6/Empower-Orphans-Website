import { Metadata } from "next";
import DonateSection from "@/components/sections/DonateSection";
import Footer from "@/components/Footer";
import { getPublicDonationProgress } from "@/app/admin/actions/donation";

export const metadata: Metadata = {
  title: "Donate",
  description: "Donate to Empower Orphans - your contribution directly supports food, education, healthcare, and shelter for orphaned children worldwide. Every dollar changes lives.",
  keywords: ["donate to orphans", "Empower Orphans donation", "charity donation", "support orphaned children", "help children in need"],
  openGraph: {
    title: "Donate | Empower Orphans",
    description: "Your donation directly supports orphaned children with food, education, healthcare, and shelter. Every dollar makes a difference.",
    type: "website",
  },
  alternates: {
    canonical: "/donate",
  },
};

export default async function DonatePage() {
  // Fetch current donation progress from database
  const donationAmount = await getPublicDonationProgress();

  return (
    <>
      <main className="pt-24">
        <DonateSection variant="full" currentAmount={donationAmount} />
      </main>
      <Footer />
    </>
  );
}
