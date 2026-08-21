import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { SITE_NAME, SITE_URL } from '@/shared/config'

export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * 링크 공유 시 노출되는 대표 이미지.
 *
 * @description
 * 로고 SVG 는 한글이 모두 패스로 그려져 있어 별도 한글 폰트 없이 렌더링된다.
 * (satori 는 woff2 를 지원하지 않아 프로젝트의 Pretendard 는 여기서 쓸 수 없다)
 */
export default async function OpengraphImage() {
  const logo = await readFile(
    path.join(process.cwd(), 'public', 'logo.svg'),
    'utf-8',
  )
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        backgroundColor: '#ffffff',
        borderBottom: '16px solid #3046EC',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} width={720} height={161} alt='' />
      <div style={{ fontSize: 36, color: '#64748b', letterSpacing: -1 }}>
        {SITE_URL.replace('https://', '')}
      </div>
    </div>,
    size,
  )
}
