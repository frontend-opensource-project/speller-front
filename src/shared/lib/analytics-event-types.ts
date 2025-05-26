import { z } from 'zod'

export const GA_ACTIONS = {
  CHECK_TRIGGERED: 'check_triggered',
  CHECK_COMPLETED: 'check_completed',
  CHECK_RESULT_NO_ERROR: 'check_result_no_error',
  CHECK_RESULT_RESPONSE_ERROR: 'check_result_response_error',
  CHECK_RESULT_RESPONSE_UNKNOWN: 'check_result_response_unknown',
  ERROR_DETAIL_OPENED: 'error_detail_opened',
  ERROR_DETAIL_CLOSED: 'error_detail_closed',
  CORRECTION_WORD_CLICKED: 'correction_word_clicked',
  MANUAL_CORRECTION_SUBMITTED: 'manual_correction_submitted',
  CORRECTION_FEEDBACK_OPENED: 'correction_feedback_opened',
  CORRECTION_FEEDBACK_SUBMITTED: 'correction_feedback_submitted',
} as const

export const GA_EVENT_TYPE = {
  EVENT: 'event',
  EXCEPTION: 'exception',
} as const

export const METHOD = ['button', 'keyboard', 'drag', 'hover'] as const

// spacing: 띄어쓰기 오류
// typo: 오탈자 오류
// context: 문맥상 오류
const CORRECTED_ERROR_TYPE = ['spacing', 'typo', 'context'] as const
export type CorrectedErrorType = (typeof CORRECTED_ERROR_TYPE)[number]

// suggested: 1순위 대치어
// original: 원문
// corrected_list: 대치어 리스트
const WORD_TEXT_TYPE = ['corrected_list', 'original', 'suggested'] as const
export type WordTextType = (typeof WORD_TEXT_TYPE)[number]

export const SECTION = [
  'contact_form',
  'original_text',
  'correction_item',
  'corrected_text',
] as const
export type SectionType = (typeof SECTION)[number]

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

export const ErrorDetailOpenedSchema = z.object({
  corrected_error_type: z.enum(CORRECTED_ERROR_TYPE),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
})

export const ErrorDetailClosedSchema = z.object({
  corrected_error_type: z.enum(CORRECTED_ERROR_TYPE),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
})

export const CorrectionWordClickedSchema = z.object({
  word_text_type: z.enum(WORD_TEXT_TYPE),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
  corrected_error_type: z.enum(CORRECTED_ERROR_TYPE),
})

export const ManualCorrectionSubmittedSchema = z.object({
  manual_correction_text_length: z.number(),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
  corrected_error_type: z.enum(CORRECTED_ERROR_TYPE),
})

export const CorrectionFeedbackOpenedSchema = z.object({
  method: z.enum(METHOD),
  section: z.enum(SECTION),
  corrected_error_type: z.enum(CORRECTED_ERROR_TYPE),
})

export const CorrectionFeedbackSubmittedSchema = z.object({
  feedback_text_length: z.number(),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
  corrected_error_type: z.enum(CORRECTED_ERROR_TYPE),
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
export type ErrorDetailOpenedParams = z.infer<typeof ErrorDetailOpenedSchema>
export type ErrorDetailClosedParams = z.infer<typeof ErrorDetailClosedSchema>
export type CorrectionWordClickedParams = z.infer<
  typeof CorrectionWordClickedSchema
>
export type ManualCorrectionSubmittedParams = z.infer<
  typeof ManualCorrectionSubmittedSchema
>
export type CorrectionFeedbackOpenedParams = z.infer<
  typeof CorrectionFeedbackOpenedSchema
>
export type CorrectionFeedbackSubmittedParams = z.infer<
  typeof CorrectionFeedbackSubmittedSchema
>

type GAEventMap = {
  checkTriggered: z.infer<typeof CheckTriggeredSchema>
  checkCompleted: z.infer<typeof CheckCompletedSchema>
  checkResultNoError: z.infer<typeof CheckResultNoErrorSchema>
  checkResultResponseError: z.infer<typeof CheckResultResponseErrorSchema>
  checkResultResponseUnknown: z.infer<typeof CheckResultResponseUnknownSchema>
  errorDetailOpened: z.infer<typeof ErrorDetailOpenedSchema>
  errorDetailClosed: z.infer<typeof ErrorDetailClosedSchema>
  correctionWordClicked: z.infer<typeof CorrectionWordClickedSchema>
  manualCorrectionSubmitted: z.infer<typeof ManualCorrectionSubmittedSchema>
  correctionFeedbackOpened: z.infer<typeof CorrectionFeedbackOpenedSchema>
  correctionFeedbackSubmitted: z.infer<typeof CorrectionFeedbackSubmittedSchema>
}

export type GAEventTrackerMap = {
  [K in keyof GAEventMap]: (params: GAEventMap[K]) => void
}
