'use client'

import { sendGAEvent } from '@next/third-parties/google'

import {
  GA_ACTIONS,
  GA_EVENT_TYPE,
  GAEventTrackerMap,
  CheckTriggeredParams,
  CheckCompletedParams,
  CheckResultNoErrorParams,
  CheckResultResponseErrorParams,
  ERROR_STAGE,
  CheckResultResponseUnknownParams,
  ErrorDetailOpenedParams,
  CorrectedErrorType,
  CorrectionWordClickedParams,
  WordTextType,
  SectionType,
  ManualCorrectionSubmittedParams,
  CorrectionFeedbackOpenedParams,
  CorrectionFeedbackSubmittedParams,
} from './analytics-event-types'

type Event = (typeof GA_EVENT_TYPE)[keyof typeof GA_EVENT_TYPE]
type Action = (typeof GA_ACTIONS)[keyof typeof GA_ACTIONS]
type Params = Record<string, unknown>

type CreateTracker = <TParams extends Params>(
  event: Event,
  action: Action,
) => (params: TParams) => void

const createTracker: CreateTracker = (event, action) => params => {
  sendGAEvent(event, action, { ...params })
}

const GAEvents: GAEventTrackerMap = {
  checkTriggered: createTracker<CheckTriggeredParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CHECK_TRIGGERED,
  ),
  checkCompleted: createTracker<CheckCompletedParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CHECK_COMPLETED,
  ),
  checkResultNoError: createTracker<CheckResultNoErrorParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CHECK_RESULT_NO_ERROR,
  ),
  checkResultResponseError: createTracker<CheckResultResponseErrorParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CHECK_RESULT_RESPONSE_ERROR,
  ),
  checkResultResponseUnknown: createTracker<CheckResultResponseUnknownParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CHECK_RESULT_RESPONSE_UNKNOWN,
  ),
  errorDetailOpened: createTracker<ErrorDetailOpenedParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.ERROR_DETAIL_OPENED,
  ),
  errorDetailClosed: createTracker<ErrorDetailOpenedParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.ERROR_DETAIL_CLOSED,
  ),
  correctionWordClicked: createTracker<CorrectionWordClickedParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CORRECTION_WORD_CLICKED,
  ),
  manualCorrectionSubmitted: createTracker<ManualCorrectionSubmittedParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.MANUAL_CORRECTION_SUBMITTED,
  ),
  correctionFeedbackOpened: createTracker<CorrectionFeedbackOpenedParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CORRECTION_FEEDBACK_OPENED,
  ),
  correctionFeedbackSubmitted: createTracker<CorrectionFeedbackSubmittedParams>(
    GA_EVENT_TYPE.EVENT,
    GA_ACTIONS.CORRECTION_FEEDBACK_SUBMITTED,
  ),
}

/**
 * 검사하기 버튼 클릭 시 호출되는 GA 이벤트 함수
 *
 * 사용자의 입력 길이, 검사 방식(강한 검사 여부) 등의 정보를 포함해
 * 'checkTriggered' 이벤트를 Google Analytics에 전송합니다.
 *
 * @param textLength 사용자가 입력한 원문 텍스트 길이
 * @param isStrict 강한 검사 모드 여부 (true: 강한 검사, false: 일반 검사)
 */
export const sendCheckTriggeredEvent = ({
  textLength,
  isStrict,
}: {
  textLength: number
  isStrict: boolean
}) => {
  GAEvents.checkTriggered({
    original_text_length: textLength,
    method: 'button',
    section: 'original_text',
    is_strict: isStrict,
  })
}

/**
 * 검사 완료 시점에 호출되는 GA 이벤트 함수
 *
 * 사용자의 입력 길이, 검사 소요 시간, 강한 검사 여부 등의 정보를 포함해
 * 'checkCompleted' 이벤트를 Google Analytics에 전송합니다.
 *
 * @param textLength 사용자가 입력한 원문의 글자 수
 * @param elapsedTimeMs 검사 요청부터 응답까지 소요된 시간 (밀리초 단위)
 * @param isStrict 강한 검사 모드 여부 (true: 강한 검사, false: 일반 검사)
 */
export const sendCheckCompletedEvent = ({
  textLength,
  elapsedTimeMs,
  isStrict,
}: {
  textLength: number
  elapsedTimeMs: number
  isStrict: boolean
}) => {
  GAEvents.checkCompleted({
    original_text_length: textLength,
    elapsed_time_ms: elapsedTimeMs,
    section: 'original_text',
    is_strict: isStrict,
  })
}

/**
 * 검사 결과에 맞춤법/문법 오류가 없는 경우 호출되는 GA 이벤트 함수
 *
 * 사용자가 검사하기를 실행한 후, 서버 응답 결과에 오류가 하나도 없을 때만
 * 'checkResultNoError' 이벤트를 Google Analytics로 전송합니다.
 *
 * @param textLength 검사한 원문의 글자 수
 * @param elapsedTimeMs 검사 요청부터 응답까지 소요된 시간 (밀리초 단위)
 * @param isStrict 강한 검사 모드 여부 (true: 강한 검사, false: 일반 검사)
 */
export const sendCheckResultNoErrorEvent = ({
  textLength,
  elapsedTimeMs,
  isStrict,
}: {
  textLength: number
  elapsedTimeMs: number
  isStrict: boolean
}) => {
  GAEvents.checkResultNoError({
    original_text_length: textLength,
    elapsed_time_ms: elapsedTimeMs,
    section: 'original_text',
    is_strict: isStrict,
  })
}

/**
 * 검사 결과 응답 처리 중 에러가 발생했을 때 호출되는 GA 이벤트 함수
 *
 * 맞춤법 검사 API 응답 처리 중 발생한 오류 정보를
 * Google Analytics에 이벤트로 전송합니다.
 * 에러의 발생 단계(`error_stage`)를 명시하여
 * 어떤 유형의 오류인지 등을 구분할 수 있도록 구성되어 있습니다.
 *
 * @param textLength 검사 대상 원문의 글자 수
 * @param elapsedTimeMs 요청 시작부터 오류 발생까지의 소요 시간 (밀리초 단위)
 * @param isStrict 강한 검사 모드 여부 (true: 강한 검사, false: 일반 검사)
 * @param errorStage 오류 발생 단계 (예: 'request', 'timeout' 등)
 * @param errorCode 서버 또는 내부 시스템이 부여한 오류 코드
 * @param errorMessage 에러 메시지 또는 상세 설명
 */
export const sendCheckResultResponseErrorEvent = ({
  textLength,
  elapsedTimeMs,
  isStrict,
  errorStage,
  errorCode,
  errorMessage,
}: {
  textLength: number
  elapsedTimeMs: number
  isStrict: boolean
  errorCode: number
  errorStage: (typeof ERROR_STAGE)[number]
  errorMessage: string
}) => {
  GAEvents.checkResultResponseError({
    original_text_length: textLength,
    error_stage: errorStage,
    error_code: errorCode,
    error_message: errorMessage,
    elapsed_time_ms: elapsedTimeMs,
    section: 'original_text',
    is_strict: isStrict,
  })
}

/**
 * 맞춤법 검사 응답 처리 중 예상하지 못한 오류가 발생한 경우 GA 이벤트를 전송합니다.
 *
 * 응답 처리 흐름 상에서 오류 코드 및 메시지를 수신했지만,
 * 요청 정보나 사용자의 입력 상태 등 추가 맥락을 파악할 수 없을 때 호출됩니다.
 * 예를 들어, 요청 payload가 파싱되지 않거나 오류가 명확하게 분류되지 않는 경우 등에 해당합니다.
 *
 * @param elapsedTimeMs 요청 시작부터 예외 발생까지의 소요 시간 (밀리초 단위)
 * @param errorCode 서버 또는 내부 시스템이 부여한 오류 코드
 * @param errorStage 오류 발생 단계 (예: 'unknown' 등)
 * @param errorMessage 에러 메시지 또는 상세 설명
 */
export const sendCheckResultResponseUnknownEvent = ({
  elapsedTimeMs,
  errorStage,
  errorCode,
  errorMessage,
}: {
  elapsedTimeMs: number
  errorCode: number
  errorStage: (typeof ERROR_STAGE)[number]
  errorMessage: string
}) => {
  GAEvents.checkResultResponseUnknown({
    error_stage: errorStage,
    error_code: errorCode,
    error_message: errorMessage,
    elapsed_time_ms: elapsedTimeMs,
    section: 'original_text',
  })
}

/**
 * 사용자가 교정 오류 상세 정보를 열었을 때 GA 이벤트를 전송합니다.
 *
 * - 예: 사용자가 특정 맞춤법/문법 오류 항목을 클릭하여 상세 설명을 확인한 경우
 * - 이벤트는 'button' 방식으로, 'correction_item' 섹션에서 발생한 것으로 기록됩니다.
 *
 * @param correctedErrorType 열람한 오류 유형 (띄어쓰기, 오탈자, 문맥)
 */
export const sendErrorDetailOpenedEvent = ({
  correctedErrorType,
}: {
  correctedErrorType: CorrectedErrorType
}) => {
  GAEvents.errorDetailOpened({
    method: 'button',
    section: 'correction_item',
    corrected_error_type: correctedErrorType,
  })
}

/**
 * 사용자가 교정 오류 상세 정보를 닫았을 때 GA 이벤트를 전송합니다.
 *
 * - 예: 사용자가 열린 오류 상세 설명 패널을 닫은 경우
 * - 이벤트는 'button' 방식으로, 'correction_item' 섹션에서 발생한 것으로 기록됩니다.
 *
 * @param correctedErrorType 닫은 오류 유형 (띄어쓰기, 오탈자, 문맥)
 */
export const sendErrorDetailClosedEvent = ({
  correctedErrorType,
}: {
  correctedErrorType: CorrectedErrorType
}) => {
  GAEvents.errorDetailClosed({
    method: 'button',
    section: 'correction_item',
    corrected_error_type: correctedErrorType,
  })
}

/**
 * 사용자가 대치어(수정된 단어)를 클릭했을 때 GA 이벤트를 전송합니다.
 *
 * @param correctedErrorType 해당 단어에 적용된 교정 오류 유형
 * @param wordTextType 클릭된 단어의 위치 구분
 * @param sectionType 클릭된 단어의 섹션 구분 (교정 문서, 맞춤법/문법 오류)
 */
export const sendCorrectionWordClickedEvent = ({
  correctedErrorType,
  wordTextType,
  sectionType,
}: {
  correctedErrorType: CorrectedErrorType
  wordTextType: WordTextType
  sectionType: SectionType
}) => {
  GAEvents.correctionWordClicked({
    word_text_type: wordTextType,
    corrected_error_type: correctedErrorType,
    section: sectionType,
    method: 'button',
  })
}

/**
 * 사용자가 자동 추천된 대치어가 아닌, 직접 수정한 텍스트를 제출했을 때 GA 이벤트를 전송합니다.
 *
 * - 예: 사용자가 추천된 단어 목록 대신, 오류 항목에 대해 수동으로 입력하고 확정 버튼을 누른 경우
 * - 이벤트는 'manual_correction_text_length', 'corrected_error_type', 'section' 정보를 포함하며,
 *   수동 수정이 어느 오류 항목에서, 어떤 방식으로 이루어졌는지를 분석하는 데 활용됩니다.
 *
 * @param correctedErrorType 사용자가 수동으로 수정한 오류 유형 (예: 띄어쓰기, 오탈자 등)
 * @param textLength 수동으로 입력한 텍스트의 길이
 * @param sectionType 수동 수정이 발생한 UI 영역 구분
 */
export const sendManualCorrectionSubmittedEvent = ({
  correctedErrorType,
  textLength,
  sectionType,
}: {
  correctedErrorType: CorrectedErrorType
  textLength: number
  sectionType: SectionType
}) => {
  GAEvents.manualCorrectionSubmitted({
    manual_correction_text_length: textLength,
    corrected_error_type: correctedErrorType,
    section: sectionType,
    method: 'button',
  })
}

/**
 * 사용자가 교정 결과에 대해 오류 제보(피드백)를 남기기 위해
 * '오류 제보' 버튼을 클릭하여 모달을 연 시점에 GA 이벤트를 전송합니다.
 *
 * @param correctedErrorType 사용자가 피드백을 남기려는 오류 유형 (예: 문맥 오류, 띄어쓰기 오류 등)
 * @param sectionType 해당 제보가 발생한 UI 영역 구분
 */
export const sendCorrectionFeedbackOpenedEvent = ({
  correctedErrorType,
  sectionType,
}: {
  correctedErrorType: CorrectedErrorType
  sectionType: SectionType
}) => {
  GAEvents.correctionFeedbackOpened({
    corrected_error_type: correctedErrorType,
    section: sectionType,
    method: 'button',
  })
}

/**
 * 사용자가 교정 결과에 대해 오류 제보(피드백)를 실제로 작성하여 전송했을 때 GA 이벤트를 전송합니다.
 *
 * - 예: 오류 항목 우측의 '제보하기' 버튼 클릭 → 모달 내 피드백 입력 후 제출
 *
 * @param correctedErrorType 사용자가 제보한 대상 오류 유형
 * @param textLength 사용자가 작성한 피드백 텍스트 길이
 * @param sectionType 피드백이 발생한 UI 영역 구분
 */
export const sendCorrectionFeedbackSubmittedEvent = ({
  correctedErrorType,
  textLength,
  sectionType,
}: {
  correctedErrorType: CorrectedErrorType
  textLength: number
  sectionType: SectionType
}) => {
  GAEvents.correctionFeedbackSubmitted({
    feedback_text_length: textLength,
    corrected_error_type: correctedErrorType,
    section: sectionType,
    method: 'button',
  })
}
