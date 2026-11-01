import axios from 'axios'
import { SpellerApi } from './speller-service'
import {
  CheckPayload,
  CheckResponse,
  checkPayloadSchema,
  checkResponseSchema,
  serverErrorBodySchema,
  ServerErrorBody,
} from '../model/speller-schema'
import { normalizeLineBreaks } from '../lib/normalize-line-breaks'
import { toUtf16ErrInfo } from '../lib/server-offset'

// 서버 시간 제한은 AWS 20초 하나뿐이다. 서버의 504 응답이 먼저 도착하도록 여유를 둔다.
export const CHECK_TIMEOUT_MS = 25_000

// AWS 20초 제한 초과는 errorCode 504로 온다. 408은 이전 서버 규약.
const TIMEOUT_ERROR_CODES = [504, 408]

export type CheckErrorKind =
  | 'timeout' // 서버 또는 클라이언트 시간 초과
  | 'empty' // 빈 입력 (`Text is required`)
  | 'network' // 응답 없음
  | 'rate' // 속도 제한 (HTTP 429)
  | 'server' // 그 밖의 서버 오류
  | 'schema' // 응답 형식 불일치

export interface CheckError {
  kind: CheckErrorKind
  httpStatus: number | null // 응답이 없으면 null
  errorCode: number | null // 서버 본문의 errorCode
  errorMessage: string // 로그용 원문. 화면에 그대로 보여주지 않는다
}

export type CheckTextResult =
  | { data: CheckResponse; error: null; elapsedTimeMs: number }
  | { data: null; error: CheckError; elapsedTimeMs: number }

const isServerTimeout = (body: ServerErrorBody) =>
  TIMEOUT_ERROR_CODES.includes(body.errorCode) ||
  /timed out/i.test(body.errorMessage ?? '')

const isEmptyText = (body: ServerErrorBody) =>
  body.errorCode === 400 && body.errorMessage === 'Text is required'

const classifyAxiosError = (error: unknown): CheckError => {
  if (!axios.isAxiosError(error)) {
    return {
      kind: 'network',
      httpStatus: null,
      errorCode: null,
      errorMessage: String(error),
    }
  }

  // 클라이언트 타임아웃
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return {
      kind: 'timeout',
      httpStatus: null,
      errorCode: null,
      errorMessage: error.message,
    }
  }

  if (!error.response) {
    return {
      kind: 'network',
      httpStatus: null,
      errorCode: null,
      errorMessage: error.message,
    }
  }

  const httpStatus = error.response.status
  const body = serverErrorBodySchema.safeParse(error.response.data)

  // 본문 기준으로 먼저 분류하고, 본문이 없거나 형식이 다를 때만 HTTP 상태를 본다
  if (body.success) {
    const { errorCode, errorMessage } = body.data
    const base = { httpStatus, errorCode, errorMessage: errorMessage ?? '' }
    if (isServerTimeout(body.data)) return { kind: 'timeout', ...base }
    if (isEmptyText(body.data)) return { kind: 'empty', ...base }
    if (httpStatus === 429) return { kind: 'rate', ...base }
    return { kind: 'server', ...base }
  }

  const base = { httpStatus, errorCode: null, errorMessage: error.message }
  if (httpStatus === 429) return { kind: 'rate', ...base }
  if (TIMEOUT_ERROR_CODES.includes(httpStatus))
    return { kind: 'timeout', ...base }
  return { kind: 'server', ...base }
}

/**
 * 맞춤법 검사 요청. 항상 클라이언트에서 `/api/check`로 보낸다.
 * 예외를 던지지 않고 결과 또는 분류된 오류를 돌려준다.
 */
export const checkText = async (
  payload: CheckPayload,
): Promise<CheckTextResult> => {
  const start = Date.now()
  const validPayload = checkPayloadSchema.parse({
    ...payload,
    text: normalizeLineBreaks(payload.text),
  })

  const request = () =>
    SpellerApi.check(validPayload, { timeout: CHECK_TIMEOUT_MS })

  let response
  try {
    response = await request().catch(error => {
      // 네트워크 끊김만 한 번 자동 재시도한다
      if (classifyAxiosError(error).kind === 'network') return request()
      throw error
    })
  } catch (error) {
    return {
      data: null,
      error: classifyAxiosError(error),
      elapsedTimeMs: Date.now() - start,
    }
  }

  const elapsedTimeMs = Date.now() - start
  const parsed = checkResponseSchema.safeParse(response.data)
  if (!parsed.success) {
    return {
      data: null,
      error: {
        kind: 'schema',
        httpStatus: response.status,
        errorCode: null,
        errorMessage: parsed.error.message.slice(0, 100),
      },
      elapsedTimeMs,
    }
  }

  // 서버 좌표(코드 포인트, 서식 문자 제외)를 화면에서 쓰는 UTF-16 좌표로 바꾼다
  const { errInfo, invalid } = toUtf16ErrInfo(
    parsed.data.str,
    parsed.data.errInfo,
  )
  if (invalid.length > 0) {
    console.warn('오류 위치가 원문과 맞지 않아 제외함', invalid)
  }

  return { data: { ...parsed.data, errInfo }, error: null, elapsedTimeMs }
}

// 화면에 보여줄 안내 문구. 서버의 errorMessage는 보여주지 않는다.
export const CHECK_ERROR_MESSAGE: Record<CheckErrorKind, string> = {
  timeout: '서버 응답이 늦어 검사하지 못했습니다.\n잠시 후 다시 시도해 주세요.',
  empty: '검사할 문장을 입력해 주세요.',
  network: '인터넷 연결이 끊겼습니다.\n연결되면 다시 시도해 주세요.',
  rate: '짧은 시간에 요청이 많아 잠시 제한되었습니다.\n약 15분 뒤 다시 시도할 수 있습니다.',
  server: '검사하는 중 서버에 문제가 생겼습니다.\n잠시 후 다시 시도해 주세요.',
  schema: '검사 결과를 읽지 못했습니다.\n다시 시도해 주세요.',
}
