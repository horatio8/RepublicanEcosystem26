/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/RepublicanEcosystem26' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/RepublicanEcosystem26/' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
