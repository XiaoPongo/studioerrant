import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { SiteShell } from "@/components/errant/site-shell";

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
    "Studio Errant — an independent design and writing practice. Portfolio work, essays, and long-form market teardowns. Based in India.",
  keywords: [
    "Studio Errant",
    "design portfolio",
    "writing",
    "market teardown",
    "research",
    "experiments",
    "independent practice",
  ],
  authors: [{ name: "Studio Errant" }],
  creator: "Studio Errant",
  metadataBase: new URL("https://studioerrant.in"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Studio Errant",
    description:
      "An independent design and writing practice. Portfolio work, essays, and long-form market teardowns.",
    url: "https://studioerrant.in",
    siteName: "Studio Errant",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Studio Errant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Errant",
    description:
      "An independent design and writing practice. Portfolio work, essays, and long-form market teardowns.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`,
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/apple-touch-icon.png`,
  },
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/manifest.json`,
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
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${editorial.variable} ${sans.variable} antialiased bg-background text-foreground`}
      >
        <SiteShell>{children}</SiteShell>
        <Toaster />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X7BCJRV04N"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X7BCJRV04N');
          `}
        </Script>
      </body>
    </html>
  );
}
