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
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">FairGuard</span>
      </Link>

      {/* Mode Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40">
        {modes.map((mode) => {
          const isActive = pathname === mode.href;
          return (
            <Link key={mode.href} href={mode.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={`gap-1.5 text-sm transition-all ${
                  isActive
                    ? "bg-secondary shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-base">{mode.icon}</span>
                <span className="hidden sm:inline">{mode.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
