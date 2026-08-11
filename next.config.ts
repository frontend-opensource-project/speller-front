import type { NextConfig } from 'next'

const basePath = process.env.NEXT_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // 0. 워크스페이스 루트를 이 프로젝트로 고정
  //    (상위 디렉토리의 엉뚱한 lockfile로 인한 루트 오추론/경고 방지)
  outputFileTracingRoot: __dirname,
  // 1. 동적 basePath 설정
  basePath: basePath,
  assetPrefix: basePath,
  // 1-1. 클라이언트에서 공용 자산(fetch 등) 경로에 basePath를 붙일 수 있도록 노출
  //      (next/link·next/image 와 달리 fetch 는 basePath 를 자동으로 붙이지 않음)
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
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
