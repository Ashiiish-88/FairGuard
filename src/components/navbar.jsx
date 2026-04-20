// components/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Shield,
  Search,
  Radio,
  FlaskConical,
  History,
  ScanLine,
  Menu,
  X,
} from "lucide-react";

// ─── Nav link definitions ─────────────────────────────────────────────────────

const NAV_LINKS = [
  {
    href:   "/audit",
    label:  "AUDIT",
    icon:   <ScanLine className="w-3 h-3" />,
  },
  {
    href:   "/shield",
    label:  "SHIELD",
    icon:   <Radio className="w-3 h-3" />,
  },
  {
    href:   "/stress",
    label:  "STRESS TEST",
    icon:   <FlaskConical className="w-3 h-3" />,
  },
  {
    href:   "/history",
    label:  "HISTORY",
    icon:   <History className="w-3 h-3" />,
  },
];

// Pages where we show the "RUN AUDIT" CTA
// On the audit page itself, we swap to a different label
const CTA_HIDDEN_ON = []; // show everywhere, but label changes

// ─── Main component ───────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname           = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { 
    const t = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Determine CTA state based on current page
  const isOnAudit    = pathname === "/audit";
  const isOnApp      = NAV_LINKS.some((l) => pathname.startsWith(l.href));
  const isOnLanding  = !isOnApp;

  // CTA config
  const ctaConfig = isOnAudit
    ? null // hide CTA on audit page — user is already there
    : isOnApp
    ? {
        // Inside the app — contextual action
        href:  "/audit",
        icon:  <Search className="w-3.5 h-3.5" />,
        label: "NEW AUDIT",
      }
    : {
        // Landing page — primary acquisition CTA
        href:  "/audit",
        icon:  <Search className="w-3.5 h-3.5" />,
        label: "RUN AUDIT",
      };

  return (
    <>
      <nav
        className={[
          "sticky top-0 z-50 h-16 transition-all duration-200",
          scrolled
            ? "bg-white/85 backdrop-blur-2xl shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
            : "bg-white border-b border-border",
        ].join(" ")}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-full flex items-center justify-between gap-6">

          {/* ── Logo ──────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 group"
          >
            <img src="/Navbar_Logo.svg" alt="FairGuard Logo" className="h-36 w-auto group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* ── Desktop nav links ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "relative flex items-center gap-1.5",
                    "text-[11px] font-semibold tracking-[0.1em] uppercase",
                    "transition-colors duration-150",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {/* Icon — only show on active or hover */}
                  <span
                    className={[
                      "transition-opacity duration-150",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                  >
                    {link.icon}
                  </span>
                  {link.label}

                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-[#caff3d]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right side: CTA + mobile menu ──────────────────── */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* CTA button — context-aware */}
            {ctaConfig && (
              <Link
                href={ctaConfig.href}
                className="group hidden sm:inline-flex items-stretch rounded-md overflow-hidden
                           transition-all duration-150 hover:-translate-y-px
                           hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              >
                <span className="bg-[#caff3d] px-3 py-2.5 flex items-center justify-center
                                 group-hover:bg-[#d4ff5c] transition-colors">
                  {ctaConfig.icon}
                </span>
                <span className="bg-black text-white text-[11px] font-bold tracking-[0.12em]
                                 uppercase px-4 py-2.5 flex items-center
                                 group-hover:bg-[#1a1a1a] transition-colors">
                  {ctaConfig.label}
                </span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center
                         justify-center text-muted-foreground hover:text-foreground
                         hover:bg-muted transition-all duration-150"
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X className="w-4 h-4" />
                : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-border shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold",
                    "transition-colors duration-150",
                    isActive
                      ? "bg-[#caff3d]/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <span className={isActive ? "text-foreground" : "text-muted-foreground"}>
                    {link.icon}
                  </span>
                  {link.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#caff3d]" />
                  )}
                </Link>
              );
            })}

            {/* Mobile CTA */}
            {ctaConfig && (
              <div className="pt-3 border-t border-border mt-3">
                <Link
                  href={ctaConfig.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm
                             font-bold bg-black text-[#caff3d] hover:bg-[#1a1a1a]
                             transition-colors duration-150"
                >
                  {ctaConfig.icon}
                  {ctaConfig.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}