import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Studio Errant — A digital studio built around curiosity",
    template: "%s · Studio Errant",
  },
  description:
    "Studio Errant is a digital studio built around curiosity. We build what curiosity discovers. Wander deliberately.",
  keywords: [
    "Studio Errant",
    "digital studio",
    "curiosity",
    "design",
    "AI",
    "research",
    "experiments",
    "creative studio",
  ],
  authors: [{ name: "Studio Errant" }],
  creator: "Studio Errant",
  metadataBase: new URL("https://studioerrant.example"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Studio Errant",
    description:
      "A digital studio built around curiosity. We build what curiosity discovers.",
    url: "https://studioerrant.example",
    siteName: "Studio Errant",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Errant",
    description:
      "A digital studio built around curiosity. We build what curiosity discovers.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${spaceGrotesk.variable} ${plexSerif.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
