import { Metadata } from "next";
import DonateSection from "@/components/sections/DonateSection";
import Footer from "@/components/Footer";
import { getPublicDonationProgress } from "@/app/admin/actions/donation";

export const metadata: Metadata = {
  title: "Donate | Empower Orphans",
  description: "Your donation directly supports food, education, healthcare, and shelter for orphaned children. Every dollar changes lives.",
  openGraph: {
    title: "Donate | Empower Orphans",
    description: "Support orphaned children through our student-led fundraising campaigns",
    type: "website",
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
