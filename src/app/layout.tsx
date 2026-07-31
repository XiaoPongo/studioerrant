import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/*
  Typography
  ------------------------------------------------------------
  Editorial display face: Bodoni Moda — the closest freely-available
  Google Font to the official Studio Errant wordmark. High stroke
  contrast, sharp unbracketed serifs, ball terminals, vertical stress.
  Used for the wordmark, hero, and large reflective passages.

  Body / interface face: Inter — quiet, highly readable, neutral.
  Used for navigation, captions, and UI chrome. Never for display.
*/
const editorial = Bodoni_Moda({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Studio Errant",
    template: "%s · Studio Errant",
  },
  description:
    "Studio Errant. A living practice of design, writing, research, and experiments. Unfinished, by intention.",
  keywords: [
    "Studio Errant",
    "design",
    "writing",
    "research",
    "experiments",
    "independent practice",
  ],
  authors: [{ name: "Studio Errant" }],
  creator: "Studio Errant",
  metadataBase: new URL("https://studioerrant.example"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Studio Errant",
    description:
      "A living practice of design, writing, research, and experiments. Unfinished, by intention.",
    url: "https://studioerrant.example",
    siteName: "Studio Errant",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Errant",
    description:
      "A living practice of design, writing, research, and experiments.",
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
        className={`${editorial.variable} ${sans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
