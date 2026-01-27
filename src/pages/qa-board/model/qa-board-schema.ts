import { z } from 'zod'

export const qaBoardStatusSchema = z.enum(['pending', 'answered'])

// Board2 테이블 스키마 매핑
export const board2Schema = z.object({
  numm: z.number(), // 고유 글 번호
  fldinx: z.number(), // 게시판 표시 번호
  name: z.string(), // 작성자 이름
  title: z.string(), // 글 제목
  mail: z.string().nullable(), // 작성자 메일
  url: z.string().nullable(), // URL (사용 안함)
  writeday: z.string(), // 작성 날짜
  pwd: z.string(), // 비밀번호
  ref: z.number(), // 참조 글번호
  step: z.number(), // 참조 횟수
  re_level: z.number(), // 참조 레벨
  readnum: z.number(), // 조회수
  content: z.string(), // 글 내용
})

export const qaBoardItemSchema = z.object({
  id: z.number(), // numm
  displayId: z.number(), // fldinx
  title: z.string(),
  content: z.string(),
  author: z.string(), // name
  email: z.string().nullable().optional(), // mail
  createdAt: z.string(), // writeday
  status: qaBoardStatusSchema,
  views: z.number(), // readnum
  answerCount: z.number().default(0),
  isAnswer: z.boolean().default(false), // ref !== numm이면 답글
  parentId: z.number().nullable(), // ref
})

export const qaBoardListResponseSchema = z.object({
  items: z.array(qaBoardItemSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
})

export const qaBoardAnswerSchema = z.object({
  id: z.number(),
  content: z.string(),
  author: z.string(),
  createdAt: z.string(),
  step: z.number(),
  reLevel: z.number(),
  ref: z.number(), // 참조하는 글 번호
})

export const qaBoardDetailSchema = qaBoardItemSchema.extend({
  answers: z.array(qaBoardAnswerSchema).default([]),
})

export const qaBoardWriteSchema = z.object({
  title: z.string().min(3, '제목은 최소 3자 이상이어야 합니다.'),
  content: z.string().min(10, '내용은 최소 10자 이상이어야 합니다.'),
  author: z.string().min(2, '작성자 이름은 최소 2자 이상이어야 합니다.'),
  email: z
    .string()
    .email('올바른 이메일 형식이 아닙니다.')
    .optional()
    .or(z.literal('')),
  password: z.string().min(4, '비밀번호는 최소 4자 이상이어야 합니다.'),
})

export type Board2Record = z.infer<typeof board2Schema>
export type QaBoardItem = z.infer<typeof qaBoardItemSchema>
export type QaBoardListResponse = z.infer<typeof qaBoardListResponseSchema>
export type QaBoardAnswer = z.infer<typeof qaBoardAnswerSchema>
export type QaBoardDetail = z.infer<typeof qaBoardDetailSchema>
export type QaBoardWriteInput = z.infer<typeof qaBoardWriteSchema>
