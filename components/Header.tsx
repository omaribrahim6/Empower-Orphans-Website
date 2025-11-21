"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./NavLink";

export default function Header() {
  const pathname = usePathname();
  
  // Don't render header on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  // Pages with light backgrounds at top need dark header from the start
  const lightBackgroundPages = ["/about", "/donate", "/chapters"];
  const needsDarkHeader = lightBackgroundPages.includes(pathname);
  
  const [isScrolled, setIsScrolled] = useState(needsDarkHeader);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update header style when pathname changes
  useEffect(() => {
    if (needsDarkHeader || window.scrollY > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, [pathname, needsDarkHeader]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20 || needsDarkHeader);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [needsDarkHeader]);

  const navLinks = [
    { href: "/#top", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/donate", label: "Donate" },
    { href: "/chapters", label: "Chapters" },
    { href: "/events", label: "Events" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-slide-down ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95" aria-label="Empower Orphans home">
            <Image
              src={isScrolled || isMobileMenuOpen ? "/logolarge.svg" : "/logolargelight.svg"}
              alt="Empower Orphans"
              width={220}
              height={44}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <div key={link.href} className="animate-fade-in">
                <NavLink
                  href={link.href}
                  label={link.label}
                  isScrolled={isScrolled}
                />
              </div>
            ))}
            <div className="animate-fade-in">
              <Link
                href="/chapters"
                className="btn-pill bg-eo-teal text-white px-4 xl:px-6 py-2.5 text-sm font-semibold 
                         hover:brightness-110 transition-all btn-glow whitespace-nowrap"
              >
                Join a Chapter
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-eo-blue/10 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className={`w-6 h-6 ${isScrolled || isMobileMenuOpen ? "text-eo-dark" : "text-white"}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden overflow-hidden transition-all duration-300 animate-fade-in">
            <div className="py-4 space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isScrolled={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-eo-dark hover:bg-eo-bg/50 rounded-lg transition-colors"
                />
              ))}
              <Link
                href="/chapters"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block mx-4 text-center btn-pill bg-eo-teal text-white px-6 py-2.5 text-sm font-semibold whitespace-nowrap"
              >
                Join a Chapter
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

