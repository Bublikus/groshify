import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable optimizations for better performance
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },

  // Compress responses for better performance
  compress: true,

  // Optimize font loading
  optimizeFonts: true,
};

export default nextConfig;
