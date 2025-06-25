/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Explicitly disable static export to ensure NextAuth works properly
  output: undefined,
  // Ensure we're not in standalone mode which could cause issues
  experimental: {
    // Remove any experimental features that might interfere
  },
};

module.exports = nextConfig;