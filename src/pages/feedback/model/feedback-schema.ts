import { z } from 'zod'

export const feedbackPayloadSchema = z.object({
  content: z.string(), // 사용자 의견 내용
})

export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>
