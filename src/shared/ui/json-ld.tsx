import { FC } from 'react'
import {
  CONTACT_INFO,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_SHORT_NAME,
  SITE_URL,
} from '@/shared/config'

/**
 * JSON-LD 구조화 데이터를 <script>로 렌더링한다.
 *
 * @description
 * `</script>` 로 스크립트 태그가 조기 종료되는 것을 막기 위해 `<` 를 이스케이프한다.
 */
const JsonLd: FC<{ data: Record<string, unknown> }> = ({ data }) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
)

/** 운영 주체. 다른 구조화 데이터에서 publisher 로 참조한다. */
const ORGANIZATION_ID = `${SITE_URL}/#organization`

/**
 * 구글 검색 결과에 노출되는 '사이트 이름'과 운영 주체를 알려 주는 구조화 데이터.
 *
 * @description
 * - 구글은 대표(홈) 페이지의 마크업만 사용하므로 전 페이지에 있어도 무방하다.
 * - 루트 레이아웃의 <head>에서 렌더링한다.
 * @see https://developers.google.com/search/docs/appearance/site-names
 */
export const WebSiteJsonLd = () => (
  <>
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_SHORT_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: `${SITE_URL}/`,
        inLanguage: 'ko',
        publisher: { '@id': ORGANIZATION_ID },
      }}
    />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: '㈜나라인포테크',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo.svg`,
        telephone: CONTACT_INFO.tel.value,
        email: CONTACT_INFO.email.value,
      }}
    />
  </>
)

/**
 * 맞춤법 검사기라는 도구의 성격을 알려 주는 구조화 데이터. 메인 페이지에만 둔다.
 *
 * @description
 * `offers.price: '0'` 은 무료 이용을 뜻한다. 구글이 요구하는 필수 항목이라
 * 무료여도 생략하지 않는다.
 */
export const SpellerAppJsonLd = () => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_SHORT_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: `${SITE_URL}/speller/`,
      description: SITE_DESCRIPTION,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      inLanguage: 'ko',
      browserRequirements: '자바스크립트를 지원하는 최신 웹 브라우저',
      publisher: { '@id': ORGANIZATION_ID },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KRW',
      },
    }}
  />
)

/** 공지 상세처럼 발행일이 있는 글을 위한 구조화 데이터 */
export const ArticleJsonLd = ({
  path,
  headline,
  datePublished,
}: {
  path: string
  headline: string
  datePublished: string
}) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      datePublished,
      dateModified: datePublished,
      inLanguage: 'ko',
      mainEntityOfPage: `${SITE_URL}${path}/`,
      publisher: { '@id': ORGANIZATION_ID },
    }}
  />
)

/** 검색 결과에 사이트 내 경로를 표시하기 위한 구조화 데이터 */
export const BreadcrumbJsonLd = ({
  items,
}: {
  items: { name: string; path: string }[]
}) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}/`,
      })),
    }}
  />
)

export default JsonLd
