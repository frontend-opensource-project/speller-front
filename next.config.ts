import type { NextConfig } from 'next'

const basePath = process.env.NEXT_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // 1. 동적 basePath 설정
  basePath: basePath,
  assetPrefix: basePath,
  // 2. Trailing Slash 리다이렉트 루프 방지
  trailingSlash: true,
  images: {
    // 👇 basePath 값이 있으면(true) 최적화를 끄고, 없으면(false) 켭니다.
    unoptimized: !!basePath,
  },
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
