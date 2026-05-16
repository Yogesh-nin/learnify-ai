import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import Provider from "./provider";
import DashboardLayoutWrapper from "./dashboard/_components/DashboardLayoutWrapper";
import { Toaster } from "sonner";
import { CourseProvider } from "../context/CourseContext";
import { ThemeProvider } from "./_components/ThemeProvider";
import { AnimatedThemeToggler } from "./_components/AnimatedThemeToggler";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Learnify",
    template: "%s | Learnify",
  },
  description:
    "AI-powered learning platform. Create courses, study with notes, flashcards, quizzes, and Q&A.",
  applicationName: "Learnify",
  authors: [{ name: "Learnify" }],
  creator: "Learnify",
  keywords: [
    "Learnify",
    "AI learning",
    "LMS",
    "online courses",
    "flashcards",
    "study notes",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/logo.svg",
        color: "#2563eb",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Learnify",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Learnify",
    title: "Learnify",
    description:
      "AI-powered learning platform. Create courses, study with notes, flashcards, quizzes, and Q&A.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Learnify",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Learnify",
    description:
      "AI-powered learning platform. Create courses, study with notes, flashcards, quizzes, and Q&A.",
    images: ["/android-chrome-512x512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1117" },
  ],
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className} suppressHydrationWarning>
          <ThemeProvider>
            <Provider>
              <CourseProvider>
                <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
              </CourseProvider>
            </Provider>
            <Toaster richColors position="top-right" />
            <AnimatedThemeToggler />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
