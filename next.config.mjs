/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/.prisma/client/libquery_engine*'],
    },
  },
};

export default nextConfig;
