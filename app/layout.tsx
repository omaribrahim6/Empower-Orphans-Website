import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sub",
  display: "swap",
  preload: true,
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
  preload: true,
});

// Base URL for SEO - update this to your production domain
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://empowerorphans.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Empower Orphans | Student-Led Nonprofit Supporting Orphaned Children",
    template: "%s | Empower Orphans",
  },
  description: "Empower Orphans is a student-led nonprofit with chapters at Carleton University and uOttawa. We fundraise, volunteer, and advocate to support orphaned and vulnerable children worldwide. Join our mission to make a difference.",
  keywords: [
    "Empower Orphans",
    "empower orphans",
    "orphan charity",
    "student nonprofit",
    "children's charity",
    "Ottawa charity",
    "Carleton University nonprofit",
    "uOttawa charity",
    "volunteer for orphans",
    "donate to orphans",
    "help orphaned children",
    "student-led charity",
    "orphan support",
    "children's nonprofit",
    "humanitarian aid",
    "youth volunteer organization",
  ],
  authors: [{ name: "Empower Orphans", url: siteUrl }],
  creator: "Empower Orphans",
  publisher: "Empower Orphans",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Empower Orphans | Student-Led Nonprofit Supporting Orphaned Children",
    description: "Join our student-led nonprofit supporting orphaned and vulnerable children through fundraising, volunteering, and advocacy. Chapters at Carleton and uOttawa.",
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "Empower Orphans",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Empower Orphans - Student-Led Nonprofit Supporting Orphaned Children",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empower Orphans | Student-Led Nonprofit",
    description: "Student-led nonprofit supporting orphaned children through fundraising and volunteering. Join us!",
    images: ["/opengraph-image.png"],
    creator: "@EmpowerOrphans",
    site: "@EmpowerOrphans",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "nonprofit",
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5a0" },
    { media: "(prefers-color-scheme: dark)", color: "#0ea5a0" },
  ],
};

// JSON-LD Structured Data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Empower Orphans",
      alternateName: ["Empower Orphans Carleton", "Empower Orphans uOttawa"],
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon-512x512.png`,
        width: 512,
        height: 512,
      },
      image: `${siteUrl}/opengraph-image.png`,
      description: "Student-led nonprofit supporting orphaned and vulnerable children through fundraising, volunteering, and advocacy.",
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      sameAs: [
        "https://www.linkedin.com/company/empowerorphans/",
        "https://www.instagram.com/empowerorphans_carleton/",
        "https://www.instagram.com/empowerorphans_uottawa/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Empower Orphans",
      description: "Student-led nonprofit supporting orphaned children",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/?s={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-CA",
    },
    {
      "@type": "NonprofitType",
      "@id": `${siteUrl}/#nonprofit`,
      name: "Empower Orphans",
      description: "A student-led charitable organization dedicated to supporting orphaned and vulnerable children worldwide.",
      url: siteUrl,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

