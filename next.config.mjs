/** @type {import('next').NextConfig} */
const nextConfig = {
    // Other Next.js configurations...
    images: {
      unoptimized: true, // Disables image optimization for the static export
    },
  };
  
  export default nextConfig;