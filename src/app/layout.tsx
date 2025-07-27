import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PWAProvider } from "@/components/PWAProvider";
import { isPWAEnabled } from "@/config/pwa";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Groshify - Personal Finance Management",
    template: "%s | Groshify",
  },
  description:
    "Take control of your finances with Groshify. Track expenses, manage budgets, and achieve your financial goals with our intuitive personal finance management app.",
  keywords: [
    "finance",
    "budgeting",
    "expense tracking",
    "money management",
    "personal finance",
  ],
  authors: [{ name: "Bublik" }],
  creator: "Groshify",
  publisher: "Groshify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://groshify.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Groshify - Personal Finance Management",
    description:
      "Take control of your finances with Groshify. Track expenses, manage budgets, and achieve your financial goals.",
    url: "https://groshify.com",
    siteName: "Groshify",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Groshify - Personal Finance Management",
    description:
      "Take control of your finances with Groshify. Track expenses, manage budgets, and achieve your financial goals.",
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
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
  ...(isPWAEnabled() && { manifest: "/favicon/site.webmanifest" }),
  other: {
    "theme-color": "#ffffff",
    "msapplication-TileColor": "#ffffff",
    viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
    ...(isPWAEnabled() && {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "Groshify",
      "mobile-web-app-capable": "yes",
      "application-name": "Groshify",
      "msapplication-config": "/browserconfig.xml",
    }),
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
        <meta
          name="description"
          content="Your personal finance management app"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isPWAEnabled() ? (
          <PWAProvider>
            {children}
          </PWAProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
