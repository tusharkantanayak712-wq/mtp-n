import type { NextConfig } from "next";

const nextConfig = {

  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // cache optimized images for 24 hours to reduce CPU load
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      {
        protocol: "https",
        hostname: "busan-public.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "1gamestopup.com",
      }
    ],
  },
  serverExternalPackages: ["nodemailer"],
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
