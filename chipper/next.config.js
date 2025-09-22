/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'res.cloudinary.com', // Your Cloudinary domain
        'placehold.co'         // For placeholder images
      ],
    },
    experimental: {
      // Allow cross-origin requests during development from your LAN IP
      allowedDevOrigins: ['http://192.168.100.5:3000'],
    },
  };
  
  module.exports = nextConfig;
  