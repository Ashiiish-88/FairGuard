import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "FairGuard — The Bias Firewall for AI",
  description:
    "Audit, monitor, and stress-test your AI systems for hidden bias. Upload data, watch decisions in real-time, and expose discrimination — all in plain English.",
  keywords: ["AI bias", "fairness", "audit", "machine learning", "discrimination", "EEOC", "EU AI Act"],
  openGraph: {
    title: "FairGuard — The Bias Firewall for AI",
    description: "Audit, monitor, and stress-test your AI systems for hidden bias — all in plain English.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FairGuard — The Bias Firewall for AI",
    description: "Audit, monitor, and stress-test your AI systems for hidden bias.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
