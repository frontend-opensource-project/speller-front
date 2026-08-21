import type { MetadataRoute } from 'next'
import {
  DYNAMIC_ROUTE_PREFIX,
  EXTERNAL_SITEMAP_PATHS,
  ROUTES,
  SITE_URL,
  type SiteRoute,
} from '@/shared/config'
import { getNoticeDetails } from '@/pages/notice-detail'

/**
 * 공지 JSON 이 배포 없이도 반영되도록 1시간마다 다시 만든다.
 */
export const revalidate = 3600

/** trailingSlash: true 설정에 맞춰 끝 슬래시를 붙인 절대 URL 을 만든다. */
const toUrl = (path: string) => `${SITE_URL}${path}/`

const toEntry = (route: SiteRoute): MetadataRoute.Sitemap[number] => ({
  url: toUrl(route.path),
  priority: route.priority,
  changeFrequency: route.changeFrequency,
})

/** "2026-08-10" 형식의 날짜 문자열을 Date 로 바꾼다. 형식이 어긋나면 생략한다. */
const toDate = (value: string) => {
  const matched = value.match(/^\d{4}-\d{2}-\d{2}/)
  return matched ? new Date(matched[0]) : undefined
}

const getNoticeEntries = async (): Promise<MetadataRoute.Sitemap> => {
  const notices = await getNoticeDetails()

  return notices.map(notice => ({
    url: toUrl(`${DYNAMIC_ROUTE_PREFIX.notice}/${notice.id}`),
    lastModified: toDate(notice.date),
    priority: 0.6,
    changeFrequency: 'yearly' as const,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ROUTES 에서 색인 대상만 추린다. noindex 경로는 여기서 자동으로 빠진다.
  const staticEntries = Object.values(ROUTES)
    .filter(route => route.index)
    .map(toEntry)

  const noticeEntries = await getNoticeEntries()

  return [
    ...staticEntries,
    ...EXTERNAL_SITEMAP_PATHS.filter(route => route.index).map(toEntry),
    ...noticeEntries,
  ]
}
