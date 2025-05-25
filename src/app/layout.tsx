import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { FunFactProvider } from "@/context/FunFactContext";
import FunFactToast from "@/components/ui/FunFactToast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anil Sahith Portfolio | Software Engineer & AI/ML Engineer",
  description: "Personal portfolio of Anil, a Software Engineer, AI/ML Engineer, and Data Scientist.",
  keywords: ["portfolio", "software engineer", "AI engineer", "ML engineer", "data scientist", "developer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <FunFactProvider>
            <ThemeToggle />
            {children}
            <FunFactToast />
          </FunFactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
