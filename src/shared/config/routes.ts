import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME, SITE_URL } from './site'

export interface SiteRoute {
  /** basePath 를 제외한 경로 (끝 슬래시 없음) */
  path: string
  /** 검색 색인 허용 여부. false 면 페이지에 noindex 가 붙고 사이트맵에서도 빠진다. */
  index: boolean
  /**
   * 페이지별 meta description.
   * 구글이 검색 결과에 보여주는 길이에 맞춰 한글 기준 70~90자를 넘기지 않는다.
   * 색인 대상 페이지는 서로 다른 설명을 갖는다 (중복 설명은 페이지 구분을 방해한다).
   */
  description?: string
  priority?: number
  changeFrequency?:
    'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

/**
 * 사이트의 정적 경로 목록. 색인 정책의 단일 출처다.
 *
 * @description
 * - 각 페이지는 `seoMetadata()` 로 여기서 robots / canonical 을 가져간다.
 * - `app/sitemap.ts` 는 `index: true` 인 항목만 사이트맵에 넣는다.
 * 경로를 추가할 때 이 표에만 등록하면 두 곳에 동시에 반영된다.
 */
export const ROUTES = {
  speller: {
    path: '/speller',
    index: true,
    priority: 1.0,
    changeFrequency: 'monthly',
    description: SITE_DESCRIPTION,
  },
  about: {
    path: '/about',
    index: true,
    priority: 0.8,
    changeFrequency: 'yearly',
    description:
      '바른한글은 1994년부터 무료로 제공되어 온 ‘한국어 맞춤법/문법 검사기’의 새 이름입니다. 부산대 인공지능연구실과 ㈜나라인포테크가 함께 만들어 왔습니다.',
  },
  guide: {
    path: '/guide',
    index: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    description:
      '바른한글 맞춤법 검사기 사용법을 화면별로 안내합니다. 원문 입력, 강한 검사, 대치어 선택과 직접 수정, 오류 제보까지 순서대로 따라 해 보세요.',
  },
  qaBoard: {
    path: '/qa-board',
    index: true,
    priority: 0.8,
    changeFrequency: 'weekly',
    description:
      '바른한글 맞춤법 검사기를 쓰다가 궁금한 점을 남기고 답변을 받아 보세요. 다른 이용자들이 남긴 질문과 답변도 함께 확인할 수 있습니다.',
  },
  feedback: {
    path: '/feedback',
    index: true,
    priority: 0.5,
    changeFrequency: 'yearly',
    description:
      '바른한글 맞춤법 검사기에 대한 의견과 오류 제보를 남겨 주세요. 보내 주신 내용은 검사 품질을 개선하는 데 활용됩니다.',
  },
  order: {
    path: '/order',
    index: true,
    priority: 0.5,
    changeFrequency: 'yearly',
    description:
      '바른한글 검사기는 온라인 API와 오프라인 API 두 가지 형태로 제공됩니다. 도입을 검토 중이시라면 이용 형태와 구매 문의 방법을 확인해 보세요.',
  },

  // 색인 대상이 아닌 경로
  qaBoardWrite: { path: '/qa-board/write', index: false },
  feedbackSubmitted: { path: '/feedback/submitted', index: false },
  results: { path: '/results', index: false },
  noErrors: { path: '/no-errors', index: false },
  timeout: { path: '/timeout', index: false },
  invalidAccess: { path: '/invalid-access', index: false },
  adsTest: { path: '/ads-test', index: false },
  /** Cloudflare 속도 제한에 걸린 방문자에게 보여 주는 안내 페이지 */
  rateLimit: { path: '/rate-limit', index: false },
} as const satisfies Record<string, SiteRoute>

/**
 * 동적 경로의 부모.
 *
 * @description
 * 공지 상세만 색인 대상이며, 사이트맵은 `app/sitemap.ts` 에서 개별 URL 을 만들어 붙인다.
 * 묻고 답하기 상세(`/qa-board/[id]`)는 글마다 메타데이터가 같아 noindex 이므로 여기 없다.
 */
export const DYNAMIC_ROUTE_PREFIX = {
  notice: '/notice',
} as const

/**
 * 이 Next 앱 바깥에 있지만 같은 도메인에서 서비스되는 경로.
 * 사이트맵에서 누락되면 색인이 빠질 수 있어 함께 싣는다.
 */
export const EXTERNAL_SITEMAP_PATHS: SiteRoute[] = [
  {
    path: '/old_speller',
    index: true,
    priority: 0.7,
    changeFrequency: 'yearly',
  },
]

/**
 * 모든 페이지가 공유하는 Open Graph / Twitter 기본값.
 *
 * @description
 * Next 의 metadata 는 openGraph 객체를 병합하지 않고 통째로 덮어쓴다.
 * 페이지에서 openGraph 를 정의하면 부모의 siteName·type 등이 사라지므로,
 * 여기서 매번 전부 넣어 준다.
 */
/**
 * 링크 공유용 대표 이미지 (`app/opengraph-image.tsx` 가 생성한다).
 * metadataBase 기준의 상대 경로이며, trailingSlash 설정에 맞춰 끝 슬래시를 붙인다.
 */
const OG_IMAGE = {
  url: '/opengraph-image/',
  width: 1200,
  height: 630,
  alt: SITE_NAME,
}

const OPEN_GRAPH_BASE = {
  type: 'website' as const,
  locale: 'ko_KR',
  siteName: SITE_SHORT_NAME,
  images: [OG_IMAGE],
}

const TWITTER_BASE = {
  card: 'summary_large_image' as const,
  images: [OG_IMAGE],
}

/**
 * 페이지 metadata 에 넣을 canonical / robots / Open Graph 를 경로 정의에서 만들어 준다.
 *
 * @description
 * noindex 페이지에는 canonical 을 넣지 않는다. '색인하지 마라'와 '이 URL 이 대표다'는
 * 서로 모순되는 신호라 구글이 의도와 다르게 해석할 수 있다.
 */
export const seoMetadata = (
  route: SiteRoute,
  /**
   * 목록의 2페이지처럼 쿼리로 구분되는 화면에 붙일 문자열 (예: `?page=2`).
   * canonical 이 자기 자신을 가리키게 해서, 1페이지에만 몰리지 않도록 한다.
   */
  query?: string,
): Pick<
  Metadata,
  'alternates' | 'description' | 'openGraph' | 'robots' | 'twitter'
> => {
  // trailingSlash 설정에 맞춰 쿼리 앞에 슬래시를 붙인다.
  const url = query
    ? `${SITE_URL}${route.path}/${query}`
    : `${SITE_URL}${route.path}`

  return {
    ...(route.description && { description: route.description }),
    ...(route.index && {
      alternates: { canonical: url },
    }),
    robots: {
      index: route.index,
      follow: true,
    },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      url,
      ...(route.description && { description: route.description }),
    },
    twitter: {
      ...TWITTER_BASE,
      ...(route.description && { description: route.description }),
    },
  }
}

/**
 * 동적 페이지(공지 상세 등)가 쓰는 canonical / robots / Open Graph.
 *
 * @description
 * og:title 은 넣지 않는다. 페이지의 `title` 에 루트 레이아웃의 템플릿이 적용된 값이
 * 그대로 쓰이므로, 여기서 사이트명을 덧붙이면 두 번 붙는다.
 */
export const dynamicSeoMetadata = ({
  path,
  description,
}: {
  path: string
  description?: string
}): Pick<
  Metadata,
  'alternates' | 'description' | 'openGraph' | 'robots' | 'twitter'
> => {
  const url = `${SITE_URL}${path}`

  return {
    ...(description && { description }),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      url,
      ...(description && { description }),
    },
    twitter: {
      ...TWITTER_BASE,
      ...(description && { description }),
    },
  }
}
