/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `d31uetu06bkcms.cloudfront.net`,
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: `images.unsplash.com`,
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
