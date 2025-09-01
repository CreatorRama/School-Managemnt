/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
}

module.exports = nextConfig