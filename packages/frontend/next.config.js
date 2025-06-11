/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper static file serving on Amplify
  trailingSlash: false,
  // Enable static exports for better Amplify compatibility
  output: "export",
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Ensure proper base path handling
  basePath: "",
  // Disable server-side features for static export
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
