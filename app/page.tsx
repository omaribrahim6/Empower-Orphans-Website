import dynamic from "next/dynamic";
import HeroCarousel from "@/components/HeroCarousel";
import { getHeroImages } from "@/lib/supabase";
import { getPublicDonationProgress } from "@/app/admin/actions/donation";

// Dynamically import heavy components to split the bundle
const AboutSection = dynamic(() => import("@/components/sections/AboutSection"));
const DonateSection = dynamic(() => import("@/components/sections/DonateSection"));
const ChaptersSection = dynamic(() => import("@/components/sections/ChaptersSection"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default async function HomePage() {
  // Fetch hero images and donation progress server-side for better performance and SEO
  const heroImages = await getHeroImages();
  const donationAmount = await getPublicDonationProgress();

  return (
    <>
      <div id="top" className="scroll-mt-20" />
      <HeroCarousel images={heroImages} />
      <AboutSection variant="teaser" />
      <DonateSection variant="teaser" currentAmount={donationAmount} />
      <ChaptersSection variant="teaser" />
      <div id="contact" className="scroll-mt-20" />
      <Contact />
      <Footer />
    </>
  );
}

