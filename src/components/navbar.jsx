"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const modes = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/audit", label: "Audit Mode", icon: "🔍" },
  { href: "/shield", label: "Shield Mode", icon: "🛡️" },
  { href: "/stress", label: "Stress Test", icon: "🧪" },
  { href: "/history", label: "History", icon: "📜" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 bg-[#0D2045] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg" style={{ borderRadius: '8px' }}>
          <Shield className="w-5 h-5 text-[#00C853]" />
        </div>
        <span className="text-xl font-bold gradient-text tracking-tight">FairGuard</span>
      </Link>

      {/* Mode Tabs */}
      <div className="flex items-center gap-0.5 p-1 bg-[#F0F2F5] border border-[#E2E6ED]" style={{ borderRadius: '10px' }}>
        {modes.map((mode) => {
          const isActive = pathname === mode.href;
          return (
            <Link key={mode.href} href={mode.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={`gap-1.5 text-sm transition-all duration-200 relative ${
                  isActive
                    ? "bg-white text-[#0A1628] shadow-sm font-medium"
                    : "text-[#5A6A85] hover:text-[#0A1628] hover:bg-white/60"
                }`}
                style={{ borderRadius: '7px' }}
              >
                <span className="text-base">{mode.icon}</span>
                <span className="hidden sm:inline">{mode.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00C853] rounded-full" />
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
