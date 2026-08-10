import 'server-only'
import { readFile } from 'node:fs/promises'
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
