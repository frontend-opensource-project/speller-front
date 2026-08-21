import 'server-only'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  noticeDetailSchema,
  type NoticeDetail,
} from '../model/notice-detail.schema'

/**
 * public/notice/details/<id>.json 을 읽어 검증된 공지 상세 데이터를 반환한다.
 * 파일이 없거나 스키마 검증에 실패하면 null을 반환한다.
 */
export async function getNoticeDetail(
  id: string,
): Promise<NoticeDetail | null> {
  // 경로 조작 방지: 허용된 문자만 통과시킨다.
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null

  try {
    const file = path.join(
      process.cwd(),
      'public',
      'notice',
      'details',
      `${id}.json`,
    )
    const raw = await readFile(file, 'utf-8')
    const parsed = noticeDetailSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

/**
 * public/notice/details/ 의 모든 공지 상세를 날짜 최신순으로 반환한다.
 * 사이트맵 생성처럼 전체 목록이 필요한 곳에서 쓴다.
 */
export async function getNoticeDetails(): Promise<NoticeDetail[]> {
  try {
    const dir = path.join(process.cwd(), 'public', 'notice', 'details')
    const files = await readdir(dir)
    const ids = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace(/\.json$/, ''))

    const details = await Promise.all(ids.map(getNoticeDetail))

    return details
      .filter((detail): detail is NoticeDetail => detail !== null)
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}
