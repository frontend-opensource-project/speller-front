import { AxiosResponse } from 'axios'
import {
  CheckPayload,
  CheckResponse,
  ClickReplacePayload,
} from './speller-schema'

export interface UserReplacePayload {
  errorWord: string // 오류 문자열
  replaceWord: string // 사용자가 입력한 대치어
  sentence: string // 오류 문자열을 포함한 주변 문맥 문자열 (오류 문자열 좌/우)
}

export type NotChangePayload = {
  errorWord: string // 오류 문자열
  replaceWord: string // 1순위 대치어
  sentence: string // 오류 문자열을 포함한 주변 문맥 문자열 (오류 문자열 좌/우)
}[]

export interface VersionResponse {
  curVersion: string
}

export interface SpellerService {
  check: (payload: CheckPayload) => Promise<AxiosResponse<CheckResponse>>
  logUserReplace: (payload: UserReplacePayload) => void
  logClickReplace: (payload: ClickReplacePayload) => void
  notChange: (payload: NotChangePayload) => void
  version: () => void
}
