/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-3016eb8912d0455aba6b4cdfc60046ed.r2.dev',
      },
    ],
  },
}

module.exports = nextConfig
