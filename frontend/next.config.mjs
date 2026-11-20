/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://maa-diamond.onrender.com/api",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/card-studio',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'https://maa-diamond.onrender.com/api/auth/:path*',
      },
      {
        source: '/api/inquiries/:path*',
        destination: 'https://maa-diamond.onrender.com/api/inquiries/:path*',
      },
      {
        source: '/api/profile/:path*',
        destination: 'https://maa-diamond.onrender.com/api/profile/:path*',
      },
      {
        source: '/api/stats/:path*',
        destination: 'https://maa-diamond.onrender.com/api/stats/:path*',
      },
      {
        source: '/api/vcard/:path*',
        destination: 'https://maa-diamond.onrender.com/api/vcard/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'https://maa-diamond.onrender.com/api/users/:path*',
      },
    ];
  },
};

export default nextConfig;
