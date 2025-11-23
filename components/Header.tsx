"use client";

import { useState, useEffect, useRef } from "react";
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
  
  // Header behavior states
  const [isFloating, setIsFloating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isScrolled, setIsScrolled] = useState(needsDarkHeader);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFloatingRef = useRef(false);

  // Reset states when pathname changes (new page load)
  useEffect(() => {
    setIsFloating(false);
    setShowAnimation(false);
    if (needsDarkHeader) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, [pathname, needsDarkHeader]);

  useEffect(() => {
    const ENTER_THRESHOLD = 220;
    const EXIT_THRESHOLD = 80;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldBeFloating = isFloatingRef.current;

      if (!shouldBeFloating && currentScrollY > ENTER_THRESHOLD) {
        isFloatingRef.current = true;
        setIsFloating(true);
        setShowAnimation(true);
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = setTimeout(() => setShowAnimation(false), 450);
        setIsScrolled(true);
      } else if (shouldBeFloating && currentScrollY < EXIT_THRESHOLD) {
        isFloatingRef.current = false;
        setIsFloating(false);
        setShowAnimation(false);
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
          animationTimeoutRef.current = null;
        }
        setIsScrolled(needsDarkHeader || currentScrollY > 40);
      } else if (!shouldBeFloating) {
        setIsScrolled(needsDarkHeader || currentScrollY > 40);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, [needsDarkHeader]);

  const navLinks = [
    { href: "/#top", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/donate", label: "Donate" },
    { href: "/chapters", label: "Chapters" },
    { href: "/events", label: "Events" },
    { href: "/#contact", label: "Contact" },
  ];

  const burgerColor = isFloating || isScrolled || isMobileMenuOpen ? "bg-eo-dark" : "bg-white";

  return (
    <>
    <header
      className={`
        ${isFloating ? "fixed top-6 left-0 right-0 z-50 px-4 sm:px-6" : "absolute top-0 left-0 right-0 z-50"}
        ${showAnimation ? "animate-slide-down" : ""}
        transition-all duration-300
      `}
    >
      {isFloating ? (
        // Floating pill container
        <div
          className="header-pill relative mx-auto w-full max-w-5xl rounded-full bg-white/95 backdrop-blur-xl px-5 sm:px-8 py-4 shadow-2xl"
        >
          <nav className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95" aria-label="Empower Orphans home">
              <Image
                src="/logolarge.svg"
                alt="Empower Orphans"
                width={220}
                height={44}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    isScrolled={true}
                  />
                </div>
              ))}
              <div>
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
              className="lg:hidden p-2 rounded-lg hover:bg-eo-blue/10 transition-colors flex flex-col items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`burger-line ${burgerColor} ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`burger-line mt-1.5 ${burgerColor} ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`burger-line mt-1.5 ${burgerColor} ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </nav>

          {/* Floating Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full mt-3 rounded-3xl border border-black/5 bg-white/95 px-4 py-3 shadow-xl space-y-3 mobile-menu-drop">
              {navLinks.map((link, index) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isScrolled={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-menu-item block px-4 py-2 text-eo-dark hover:bg-eo-bg/40 rounded-2xl transition-colors"
                  style={{ animationDelay: `${index * 60}ms` }}
                />
              ))}
              <Link
                href="/chapters"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-menu-item block text-center btn-pill bg-eo-teal text-white px-6 py-2.5 text-sm font-semibold whitespace-nowrap"
                style={{ animationDelay: `${navLinks.length * 60}ms` }}
              >
                Join a Chapter
              </Link>
            </div>
          )}
        </div>
      ) : (
        // Regular top header
        <div className={`
          mx-auto max-w-7xl px-6 py-4
          ${isMobileMenuOpen ? "bg-white/90 backdrop-blur-md shadow-lg" : ""}
        `}>
          <nav className="flex items-center justify-between">
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
              className="lg:hidden p-2 rounded-lg hover:bg-eo-blue/10 transition-colors flex flex-col items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`burger-line ${burgerColor} ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`burger-line mt-1.5 ${burgerColor} ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`burger-line mt-1.5 ${burgerColor} ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden overflow-hidden mobile-menu-drop">
              <div className="py-4 space-y-3">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    isScrolled={true}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mobile-menu-item block px-4 py-2 text-eo-dark hover:bg-eo-bg/50 rounded-lg transition-colors"
                    style={{ animationDelay: `${index * 60}ms` }}
                  />
                ))}
                <Link
                  href="/chapters"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-menu-item block mx-4 text-center btn-pill bg-eo-teal text-white px-6 py-2.5 text-sm font-semibold whitespace-nowrap"
                  style={{ animationDelay: `${navLinks.length * 60}ms` }}
                >
                  Join a Chapter
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
    {isMobileMenuOpen && (
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}
    </>
  );
}

