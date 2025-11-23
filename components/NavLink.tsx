"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, CSSProperties } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  isScrolled: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export default function NavLink({ href, label, isScrolled, onClick, className, style }: NavLinkProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  // Track hash changes for client-side navigation
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const isActive = () => {
    // For hash links (Home and Contact)
    if (href.startsWith("/#")) {
      const targetHash = href.slice(1); // Remove leading /
      return pathname === "/" && hash === targetHash;
    }
    
    // For standalone pages - exact match
    if (href === "/") {
      return pathname === "/" && !hash;
    }
    
    return pathname === href;
  };

  const active = isActive();

  const baseClasses = "text-sm font-medium transition-colors relative";
  const colorClasses = isScrolled 
    ? "text-eo-dark" 
    : "text-white drop-shadow-md";
  const hoverClasses = "hover:text-eo-teal";
  const activeClasses = active 
    ? "text-eo-teal font-semibold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-eo-teal after:rounded-full" 
    : "";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={className || `${baseClasses} ${colorClasses} ${hoverClasses} ${activeClasses}`}
      style={style}
    >
      {label}
    </Link>
  );
}

