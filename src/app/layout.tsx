import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { FunFactProvider } from "@/context/FunFactContext";
import FunFactToast from "@/components/ui/FunFactToast";
import GrainOverlay from "@/components/baseline/GrainOverlay";
import CommandPalette from "@/components/baseline/CommandPalette";
import SmoothScroll from "@/components/baseline/SmoothScroll";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anilsahith.vercel.app";
const description =
  "Anil Sahith — AI/ML Engineer building real-world machine learning systems and the full-stack products around them.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Anil Sahith — AI/ML Engineer",
  description,
  keywords: [
    "Anil Sahith",
    "AI engineer",
    "ML engineer",
    "machine learning",
    "deep learning",
    "edge ML",
    "software engineer",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Anil Sahith — AI/ML Engineer",
    description,
    siteName: "Anil Sahith",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anil Sahith — AI/ML Engineer",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-base text-ink font-sans antialiased" suppressHydrationWarning>
        <div className="bg-fx" aria-hidden="true" />
        <GrainOverlay />
        <SmoothScroll />
        <ThemeProvider>
          <FunFactProvider>
            {children}
            <FunFactToast />
            <CommandPalette />
          </FunFactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
