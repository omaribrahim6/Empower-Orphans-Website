import HeroCarousel from "@/components/HeroCarousel";
import AboutSection from "@/components/sections/AboutSection";
import DonateSection from "@/components/sections/DonateSection";
import ChaptersSection from "@/components/sections/ChaptersSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getHeroImages } from "@/lib/supabase";
import { getPublicDonationProgress } from "@/app/admin/actions/donation";

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

