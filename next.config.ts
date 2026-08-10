import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Strict hostname
        port: "",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;
