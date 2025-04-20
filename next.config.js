/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.builder.io'],
    unoptimized: true,
  },
  // Optimize memory usage during builds
  swcMinify: true,
  // Reduce memory usage with compiler options
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize production bundles
  productionBrowserSourceMaps: false,
  // Adjust optimizations
  experimental: {
    // Optimize bundle sizes
    optimizeCss: true,
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Optimize output
  output: 'standalone',
  // Set reasonable timeouts to prevent build hanging
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig; 