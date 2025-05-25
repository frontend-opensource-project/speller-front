import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack' }],
    })
    return config
  },
  turbopack:
    process.env.NODE_ENV === 'development'
      ? {
          rules: {
            '*.svg': {
              loaders: ['@svgr/webpack'],
              as: '*.js',
            },
          },
        }
      : {},
}

export default nextConfig
