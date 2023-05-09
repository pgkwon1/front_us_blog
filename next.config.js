/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    const destination =
      process.env.NEXT_PUBLIC_MODE === "DEV"
        ? process.env.NEXT_PUBLIC_DEV_API_URL
        : process.env.NEXT_PUBLIC_PRODUCT_API_URL;
    return [
      {
        source: "/api/:path*",
        destination: `${destination}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
