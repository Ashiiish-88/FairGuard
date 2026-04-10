import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata = {
  title: "FairGuard — The Bias Firewall for AI",
  description:
    "Audit, monitor, and stress-test your AI systems for hidden bias. Upload data, watch decisions in real-time, and expose discrimination — all in plain English.",
  keywords: ["AI bias", "fairness", "audit", "machine learning", "discrimination", "EEOC", "EU AI Act"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
