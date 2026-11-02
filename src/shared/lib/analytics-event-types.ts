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
  PREVIOUS_VERSION_CLICKED: 'previous_version_clicked',
  BUTTON_CLICKED: 'button_clicked',
  APP_INSTALL_CLICKED: 'app_install_clicked',
  APP_INSTALL_PROMPT_RESULT: 'app_install_prompt_result',
  // 긴글 모드 (계획서 §4.2)
  LONG_MODE_SUGGESTED: 'long_mode_suggested',
  LONG_MODE_ENTERED: 'long_mode_entered',
  LONG_CHECK_COMPLETED: 'long_check_completed',
  LONG_CHECK_FAILED: 'long_check_failed',
  LONG_CHECK_CHECK_ALL_CLICKED: 'long_check_check_all_clicked',
  BULK_CORRECTION_APPLIED: 'bulk_correction_applied',
  LONG_BOUNDARY_MISMATCH: 'long_boundary_mismatch',
} as const

export const GA_EVENT_TYPE = {
  EVENT: 'event',
  EXCEPTION: 'exception',
} as const

export const METHOD = ['button', 'keyboard', 'drag', 'hover'] as const

// spacing: 띄어쓰기 오류
// typo: 오탈자 오류
// context: 문맥상 오류
// common_mistake: 흔한 실수 오류
const CORRECTED_ERROR_TYPE = [
  'grammar',
  'context',
  'fail',
  'common_mistake',
] as const
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

export const BUTTON_TYPE = [
  'write',
  'remove',
  'back',
  'partial_copy',
  'all_copy',
] as const
export type ButtonType = (typeof BUTTON_TYPE)[number]

/**
 * 설치 버튼을 누른 환경.
 * prompt: 브라우저 설치 창, ios: 홈 화면 추가 안내, macos_safari: Dock 추가 안내, in_app: 외부 브라우저 안내
 */
export const INSTALL_PLATFORM = [
  'prompt',
  'ios',
  'macos_safari',
  'in_app',
] as const
export type InstallPlatform = (typeof INSTALL_PLATFORM)[number]

// 긴글 모드 구간 검사 실패 단계 (CheckErrorKind와 같음)
export const LONG_ERROR_STAGE = [
  'timeout',
  'empty',
  'network',
  'rate',
  'server',
  'schema',
] as const
export type LongErrorStage = (typeof LONG_ERROR_STAGE)[number]

// correct: 같은 오류 모두 수정, ignore: 모두 무시
export const BULK_ACTION = ['correct', 'ignore'] as const
export type BulkAction = (typeof BULK_ACTION)[number]

export const CheckTriggeredSchema = z.object({
  original_text_length: z.number(),
  method: z.enum(METHOD),
  section: z.enum(SECTION),
  is_strict_check: z.boolean(),
})

export const CheckCompletedSchema = z.object({
  original_text_length: z.number(),
  section: z.enum(SECTION),
  is_strict_check: z.boolean(),
  elapsed_time_ms: z.number(),
})

export const CheckResultNoErrorSchema = z.object({
  original_text_length: z.number(),
  section: z.enum(SECTION),
  is_strict_check: z.boolean(),
  elapsed_time_ms: z.number(),
})

export const CheckResultResponseErrorSchema = z.object({
  error_stage: z.enum(ERROR_STAGE),
  error_code: z.number(),
  error_message: z.string(),
  original_text_length: z.number(),
  section: z.enum(SECTION),
  is_strict_check: z.boolean(),
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

export const PreviousVersionClickedSchema = z.object({
  method: z.enum(METHOD),
})

export const ButtonClickedSchema = z.object({
  method: z.enum(METHOD),
  button_type: z.enum(BUTTON_TYPE),
})

export const AppInstallClickedSchema = z.object({
  platform: z.enum(INSTALL_PLATFORM),
})

export const AppInstallPromptResultSchema = z.object({
  outcome: z.enum(['accepted', 'dismissed']),
})

export const LongModeSuggestedSchema = z.object({
  text_length: z.number(),
  predicted_page_cnt: z.number(),
})

export const LongModeEnteredSchema = z.object({
  text_length: z.number(),
  total_page_cnt: z.number(),
  is_strict_check: z.boolean(),
})

export const LongCheckCompletedSchema = z.object({
  total_page_cnt: z.number(),
  text_length: z.number(),
  elapsed_time_ms: z.number(),
})

export const LongCheckFailedSchema = z.object({
  page_idx: z.number(),
  error_stage: z.enum(LONG_ERROR_STAGE),
  error_code: z.number(),
  error_message: z.string(),
})

export const LongCheckCheckAllClickedSchema = z.object({
  remaining_page_cnt: z.number(),
})

export const BulkCorrectionAppliedSchema = z.object({
  count: z.number(),
  corrected_error_type: z.enum(CORRECTED_ERROR_TYPE),
  method: z.enum(METHOD),
  bulk_action: z.enum(BULK_ACTION),
})

export const LongBoundaryMismatchSchema = z.object({
  page_idx: z.number(),
  text_length: z.number(),
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
export type PreviousVersionClickedParams = z.infer<
  typeof PreviousVersionClickedSchema
>
export type ButtonClickedParams = z.infer<typeof ButtonClickedSchema>
export type AppInstallClickedParams = z.infer<typeof AppInstallClickedSchema>
export type AppInstallPromptResultParams = z.infer<
  typeof AppInstallPromptResultSchema
>

export type LongModeSuggestedParams = z.infer<typeof LongModeSuggestedSchema>
export type LongModeEnteredParams = z.infer<typeof LongModeEnteredSchema>
export type LongCheckCompletedParams = z.infer<typeof LongCheckCompletedSchema>
export type LongCheckFailedParams = z.infer<typeof LongCheckFailedSchema>
export type LongCheckCheckAllClickedParams = z.infer<
  typeof LongCheckCheckAllClickedSchema
>
export type BulkCorrectionAppliedParams = z.infer<
  typeof BulkCorrectionAppliedSchema
>
export type LongBoundaryMismatchParams = z.infer<
  typeof LongBoundaryMismatchSchema
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
  previousVersionClicked: z.infer<typeof PreviousVersionClickedSchema>
  buttonClicked: z.infer<typeof ButtonClickedSchema>
  appInstallClicked: z.infer<typeof AppInstallClickedSchema>
  appInstallPromptResult: z.infer<typeof AppInstallPromptResultSchema>
  longModeSuggested: LongModeSuggestedParams
  longModeEntered: LongModeEnteredParams
  longCheckCompleted: LongCheckCompletedParams
  longCheckFailed: LongCheckFailedParams
  longCheckCheckAllClicked: LongCheckCheckAllClickedParams
  bulkCorrectionApplied: BulkCorrectionAppliedParams
  longBoundaryMismatch: LongBoundaryMismatchParams
}

export type GAEventTrackerMap = {
  [K in keyof GAEventMap]: (params: GAEventMap[K]) => void
}
