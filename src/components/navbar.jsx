"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, Search } from "lucide-react";

const navLinks = [
  { href: "/audit", label: "AUDIT" },
  { href: "/shield", label: "SHIELD" },
  { href: "/stress", label: "STRESS TEST" },
  { href: "/history", label: "HISTORY" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 h-16 transition-all duration-200 ${
        scrolled
          ? "bg-white/85 backdrop-blur-2xl shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
          : "bg-white border-b border-[#E5E7EB]"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#ffffff] flex items-center justify-center rounded-md">
            <Shield className="w-4 h-4 text-[#caff3d]" />
          </div>
          <span className="text-[17px] font-bold text-[#000000] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            FairGuard
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors duration-150 ${
                  isActive
                    ? "text-[#000000]"
                    : "text-[#9CA3AF] hover:text-[#000000]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Split CTA — Refold style */}
        <Link href="/audit" className="group inline-flex items-stretch rounded-md border border-[#E5E7EB] overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
          <span className="bg-[#caff3d] px-3.5 py-2.5 flex items-center border-r border-[#E5E7EB] justify-center text-black transition-colors duration-150 group-hover:bg-[#d4ff5c]">
            <Search className="w-3.5 h-3.5" />
          </span>
          <span className="bg-white text-[#000000] text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-2.5 flex items-center transition-colors duration-150 group-hover:bg-[#F3F4F6]">
            RUN AUDIT
          </span>
        </Link>
      </div>
    </nav>
  );
}
