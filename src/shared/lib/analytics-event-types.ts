import { z } from 'zod'

export const GA_ACTIONS = {
  CHECK_TRIGGERED: 'check_triggered',
} as const

export const GA_EVENT_TYPE = {
  EVENT: 'event',
  EXCEPTION: 'exception',
} as const

// 파라미터 정의
export const METHOD = ['button', 'keyboard', 'drag', 'hover'] as const
export const SECTION = [
  'original_text',
  'contact_form',
  'error_report',
  'manual_edit',
  'corrected_text',
  'error_insight',
  'error_anchor',
] as const

export const CheckTriggeredSchema = z.object({
  original_text_length: z.number(),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
  is_strict: z.boolean(),
})

export type CheckTriggeredParams = z.infer<typeof CheckTriggeredSchema>

type GAEventMap = {
  checkTriggered: z.infer<typeof CheckTriggeredSchema>
}

export type GAEventTrackerMap = {
  [K in keyof GAEventMap]: (params: GAEventMap[K]) => void
}
