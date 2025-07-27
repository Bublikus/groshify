import { NextResponse } from 'next/server';
import { getAssetUrl } from '@/config/env';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const manifest = {
    name: "Groshify - Personal Finance Management",
    short_name: "Groshify",
    description: "Take control of your finances with Groshify. Track expenses, manage budgets, and achieve your financial goals.",
    icons: [
      {
        src: getAssetUrl("/favicon/android-chrome-192x192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: getAssetUrl("/favicon/android-chrome-512x512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: getAssetUrl("/favicon/android-chrome-192x192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: getAssetUrl("/favicon/android-chrome-512x512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: getAssetUrl("/favicon/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      },
      {
        src: getAssetUrl("/favicon/favicon-16x16.png"),
        sizes: "16x16",
        type: "image/png",
        purpose: "any"
      },
      {
        src: getAssetUrl("/favicon/favicon-32x32.png"),
        sizes: "32x32",
        type: "image/png",
        purpose: "any"
      },
      {
        src: getAssetUrl("/favicon/favicon.ico"),
        sizes: "48x48",
        type: "image/x-icon"
      }
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    start_url: getAssetUrl("/"),
    scope: getAssetUrl("/"),
    orientation: "portrait",
    categories: ["finance", "productivity", "utilities"],
    lang: "en-US",
    dir: "ltr",
    prefer_related_applications: false,
    related_applications: [],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "View your financial overview",
        url: getAssetUrl("/dashboard"),
        icons: [
          {
            src: getAssetUrl("/favicon/android-chrome-192x192.png"),
            sizes: "192x192"
          }
        ]
      },
      {
        name: "Add Transaction",
        short_name: "Add",
        description: "Quickly add a new transaction",
        url: getAssetUrl("/transactions/new"),
        icons: [
          {
            src: getAssetUrl("/favicon/android-chrome-192x192.png"),
            sizes: "192x192"
          }
        ]
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
} 