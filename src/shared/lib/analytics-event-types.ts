import { z } from 'zod'

export const GA_ACTIONS = {
  CHECK_TRIGGERED: 'check_triggered',
  CHECK_COMPLETED: 'check_completed',
  CHECK_RESULT_NO_ERROR: 'check_result_no_error',
  CHECK_RESULT_RESPONSE_ERROR: 'check_result_response_error',
  CHECK_RESULT_RESPONSE_UNKNOWN: 'check_result_response_unknown',
} as const

export const GA_EVENT_TYPE = {
  EVENT: 'event',
  EXCEPTION: 'exception',
} as const

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

export const ERROR_STAGE = ['unknown', 'timeout', 'request'] as const

export const CheckTriggeredSchema = z.object({
  original_text_length: z.number(),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
  is_strict: z.boolean(),
})

export const CheckCompletedSchema = z.object({
  original_text_length: z.number(),
  section: z.enum(SECTION),
  is_strict: z.boolean(),
  elapsed_time_ms: z.number(),
})

export const CheckResultNoErrorSchema = z.object({
  original_text_length: z.number(),
  section: z.enum(SECTION),
  is_strict: z.boolean(),
  elapsed_time_ms: z.number(),
})

export const CheckResultResponseErrorSchema = z.object({
  error_stage: z.enum(ERROR_STAGE),
  error_code: z.number(),
  error_message: z.string(),
  original_text_length: z.number(),
  section: z.enum(SECTION),
  is_strict: z.boolean(),
  elapsed_time_ms: z.number(),
})

export const CheckResultResponseUnknownSchema = z.object({
  error_stage: z.enum(ERROR_STAGE),
  error_code: z.number(),
  error_message: z.string(),
  section: z.enum(SECTION),
  elapsed_time_ms: z.number(),
})

export type CheckTriggeredParams = z.infer<typeof CheckTriggeredSchema>
export type CheckCompletedParams = z.infer<typeof CheckCompletedSchema>
export type CheckResultNoErrorParams = z.infer<typeof CheckResultNoErrorSchema>
export type CheckResultResponseErrorParams = z.infer<
  typeof CheckResultResponseErrorSchema
>
export type CheckResultResponseUnknownParams = z.infer<
  typeof CheckResultResponseUnknownSchema
>

type GAEventMap = {
  checkTriggered: z.infer<typeof CheckTriggeredSchema>
  checkCompleted: z.infer<typeof CheckCompletedSchema>
  checkResultNoError: z.infer<typeof CheckResultNoErrorSchema>
  checkResultResponseError: z.infer<typeof CheckResultResponseErrorSchema>
  checkResultResponseUnknown: z.infer<typeof CheckResultResponseUnknownSchema>
}

export type GAEventTrackerMap = {
  [K in keyof GAEventMap]: (params: GAEventMap[K]) => void
}
