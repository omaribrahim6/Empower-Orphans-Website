import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Empower Orphans",
  description: "Admin dashboard for managing Empower Orphans content",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // No Header component - admin pages have their own navigation
  return <>{children}</>;
}

