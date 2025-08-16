import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import StructuredData, {
  webApplicationStructuredData,
  webSiteStructuredData,
} from "@/components/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Notesify - Smart Note Taking & Task Management",
    template: "%s | Notesify",
  },
  description:
    "Powerful note-taking and task management app. Create, organize, and manage your notes with a beautiful interface. Features real-time sync, email verification, and secure authentication.",
  keywords: [
    "notes app",
    "task management",
    "productivity",
    "note taking",
    "organization",
    "todo app",
    "digital notes",
    "task planner",
  ],
  authors: [{ name: "Nishchay Agarwal", url: "https://github.com/nishchayag" }],
  creator: "Nishchay Agarwal",
  publisher: "Notesify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.DOMAIN || "https://notesify.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Notesify - Smart Note Taking & Task Management",
    description:
      "Powerful note-taking and task management app with real-time sync and secure authentication.",
    url: process.env.DOMAIN || "https://notesify.vercel.app",
    siteName: "Notesify",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Notesify - Smart Note Taking App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notesify - Smart Note Taking & Task Management",
    description:
      "Powerful note-taking and task management app with real-time sync and secure authentication.",
    creator: "@nishchayag",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Notesify" />
        <link rel="apple-touch-icon" href="/next.svg" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <SessionWrapper>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ErrorBoundary>
            <ThemeProvider 
              attribute="class" 
              defaultTheme="system" 
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster richColors position="top-right" closeButton expand />

              {/* Structured Data */}
              <StructuredData
                type="WebApplication"
                data={webApplicationStructuredData}
              />
              <StructuredData type="WebSite" data={webSiteStructuredData} />
            </ThemeProvider>
          </ErrorBoundary>
        </body>
      </SessionWrapper>
    </html>
  );
}
