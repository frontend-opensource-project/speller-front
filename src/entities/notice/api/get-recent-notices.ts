import 'server-only'
import { getNoticeDetails } from './get-notice-detail'
import type { NoticeDetail } from '../model/notice.schema'

/** 전광판에 필요한 공지 정보 (클라이언트로 넘기므로 본문은 뺀다) */
export type RecentNotice = Pick<NoticeDetail, 'id' | 'title' | 'date'>

const DAY_MS = 24 * 60 * 60 * 1000
const KST_OFFSET_MS = 9 * 60 * 60 * 1000

/** 한국 시간 기준 오늘 날짜 (YYYY-MM-DD) */
const getKstToday = (now: number) =>
  new Date(now + KST_OFFSET_MS).toISOString().slice(0, 10)

/**
 * 올린 지 1주일이 지나지 않은 공지를 최신순으로 반환한다.
 * 날짜는 한국 시간 기준이며, 올린 날을 포함해 7일 동안 나온다.
 * (예: 11월 6일 공지는 11월 12일까지)
 */
export async function getRecentNotices({
  days = 7,
  limit = 5,
  now = Date.now(),
}: { days?: number; limit?: number; now?: number } = {}): Promise<
  RecentNotice[]
> {
  const today = getKstToday(now)
  const since = getKstToday(now - (days - 1) * DAY_MS)
  const details = await getNoticeDetails()

  return details
    .filter(({ date }) => date >= since && date <= today)
    .slice(0, limit)
    .map(({ id, title, date }) => ({ id, title, date }))
}
