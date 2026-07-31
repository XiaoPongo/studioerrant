import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/*
  Typography
  ------------------------------------------------------------
  Editorial display face: Cormorant Garamond — high stroke contrast,
  sharp terminals, the closest freely-available analogue to the
  Bodoni/Didot feel of the reference wordmark. Used for the logo
  wordmark, hero, and large reflective passages.

  Body / interface face: Inter — quiet, highly readable, neutral.
  Used for navigation, captions, and UI chrome. Never for display.

  Mono is retained for any technical metadata.
*/
const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Studio Errant",
    template: "%s · Studio Errant",
  },
  description:
    "Studio Errant. A digital studio built around curiosity. Wander deliberately.",
  keywords: [
    "Studio Errant",
    "digital studio",
    "curiosity",
    "design",
    "research",
    "experiments",
  ],
  authors: [{ name: "Studio Errant" }],
  creator: "Studio Errant",
  metadataBase: new URL("https://studioerrant.example"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Studio Errant",
    description:
      "A digital studio built around curiosity. Wander deliberately.",
    url: "https://studioerrant.example",
    siteName: "Studio Errant",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Errant",
    description:
      "A digital studio built around curiosity. Wander deliberately.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${editorial.variable} ${sans.variable} ${grotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
