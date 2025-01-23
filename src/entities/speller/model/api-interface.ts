import { AxiosResponse } from 'axios'

export interface CheckPayload {
  text: string // 검사할 텍스트 내용
  isStrictCheck?: boolean // 강한 검사 여부
  pageIdx?: number // 현재 페이지 번호
}

export enum CorrectMethod {
  띄어쓰기 = 1,
  오탈자 = 2,
  문맥 = 3,
}

export interface ErrorInfo {
  errorIdx: number // 에러 번호(0~n)
  correctMethod: CorrectMethod // 교정 방법 번호(1~n)
  start: number // str 안에서의 오류 문자열 시작 위치(0~n)
  end: number // str 안에서의 오류 문자열 끝 위치(0~n)
  orgStr: string // 오류 문자열
  candWord: string // 교정 대치어 문자열('|'로 구분)
  help: string // 도움말 내용
}

export interface CheckResponse {
  str: string // 현재 페이지에서 검사한 텍스트 전체
  errInfo: ErrorInfo[]
  totalPageCnt: number // 전체 페이지 수(1~n)
  remaningText: string // 다음 페이지에서 검사해야 할 나머지 텍스트
}

export interface CheckService {
  check: (payload: CheckPayload) => Promise<AxiosResponse<CheckResponse>>
}
