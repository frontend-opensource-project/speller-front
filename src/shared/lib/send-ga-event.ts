'use client'

import { sendGAEvent } from '@next/third-parties/google'

import {
  GA_ACTIONS,
  GA_EVENT_TYPE,
  GAEventTrackerMap,
  CheckTriggeredParams,
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
