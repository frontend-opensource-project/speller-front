import { z } from 'zod'

/** 공지 상세 데이터 스키마 (public/notice/details/<id>.json) */
export const noticeDetailSchema = z.object({
  /** 공지 고유 식별자 (라우트 세그먼트 및 파일명과 일치) */
  id: z.string(),

  /** 공지 제목 */
  title: z.string(),

  /** 공지 날짜 (YYYY-MM-DD 형식) */
  date: z.string(),

  /** 공지 본문 (마크다운) */
  body: z.string(),
})

export type NoticeDetail = z.infer<typeof noticeDetailSchema>
