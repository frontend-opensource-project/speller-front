import type { MetadataRoute } from 'next'
import {
  DYNAMIC_ROUTE_PREFIX,
  EXTERNAL_SITEMAP_PATHS,
  ROUTES,
  SITE_URL,
  type SiteRoute,
} from '@/shared/config'
import { getNoticeDetails } from '@/pages/notice-detail'
import { QaBoardApi } from '@/pages/qa-board'

/**
 * 공지 JSON 과 게시글이 배포 없이도 반영되도록 1시간마다 다시 만든다.
 */
export const revalidate = 3600

/** trailingSlash: true 설정에 맞춰 끝 슬래시를 붙인 절대 URL 을 만든다. */
const toUrl = (path: string) => `${SITE_URL}${path}/`

const toEntry = (route: SiteRoute): MetadataRoute.Sitemap[number] => ({
  url: toUrl(route.path),
  priority: route.priority,
  changeFrequency: route.changeFrequency,
})

/** "2026-01-17 오전 8:49:12" 같은 문자열에서 날짜 부분만 안전하게 뽑는다. */
const toDate = (value: string) => {
  const matched = value.match(/^\d{4}-\d{2}-\d{2}/)
  return matched ? new Date(matched[0]) : undefined
}

/** 묻고 답하기 글 목록. DB 를 쓸 수 없어도 사이트맵 전체가 실패하지 않게 한다. */
const getQaBoardEntries = async (): Promise<MetadataRoute.Sitemap> => {
  try {
    const { items } = await QaBoardApi.getList(1, 1000)

    return items.map(item => ({
      url: toUrl(`${DYNAMIC_ROUTE_PREFIX.qaBoardDetail}/${item.id}`),
      lastModified: toDate(item.createdAt),
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    }))
  } catch (error) {
    console.warn('[sitemap] 묻고 답하기 목록을 불러오지 못했습니다.', error)
    return []
  }
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

  const [noticeEntries, qaBoardEntries] = await Promise.all([
    getNoticeEntries(),
    getQaBoardEntries(),
  ])

  return [
    ...staticEntries,
    ...EXTERNAL_SITEMAP_PATHS.filter(route => route.index).map(toEntry),
    ...noticeEntries,
    ...qaBoardEntries,
  ]
}
