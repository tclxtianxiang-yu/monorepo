/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@monorepo/hello-world'],
  reactStrictMode: true,
}

module.exports = nextConfig
