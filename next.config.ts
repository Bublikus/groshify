import type { NextConfig } from "next";

// Extract base path from APP_URL
const getBasePath = () => {
  const appUrl = process.env.APP_URL || '';
  console.log('appUrl', appUrl);
  if (!appUrl) return '';
  
  // For localhost, always use empty base path
  if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
    return '';
  }
  
  // If it's a full URL, extract the path part
  if (appUrl.startsWith('http')) {
    const url = new URL(appUrl);
    return url.pathname;
  }
  
  // If it's already a path, return as is
  return appUrl;
};

const basePath = getBasePath();

const nextConfig: NextConfig = {
  // Enable optimizations for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  },
  
  // Compress responses for better performance
  compress: true,
  
  // Enable trailing slash for consistent URLs
  trailingSlash: false,
  
  // Base path from environment
  basePath: basePath,
  
  // Asset prefix from environment
  assetPrefix: basePath,
  
  // Configure headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/favicon/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
