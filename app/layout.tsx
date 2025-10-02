import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sub",
  display: "swap",
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Empower Orphans | Student-led nonprofit supporting orphaned children",
  description: "Student-led chapters at Carleton and uOttawa fundraising and volunteering to support orphaned and vulnerable children. Join us to make a difference.",
  keywords: ["empower orphans", "student nonprofit", "charity", "ottawa", "carleton", "uottawa", "orphans", "volunteer", "donate"],
  authors: [{ name: "Empower Orphans" }],
  openGraph: {
    title: "Empower Orphans",
    description: "Student-led nonprofit supporting orphaned children through fundraising and volunteering",
    type: "website",
    locale: "en_CA",
    siteName: "Empower Orphans",
  },
  twitter: {
    card: "summary_large_image",
    title: "Empower Orphans",
    description: "Student-led nonprofit supporting orphaned children",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

