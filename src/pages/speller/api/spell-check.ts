import { z } from 'zod'
import axios from 'axios'
import {
  SpellerApi,
  CheckPayload,
  checkPayloadSchema,
  checkResponseSchema,
} from '@/entities/speller'
import {
  spellCheckSchema,
  serverErrorResponseSchema,
} from '../model/spell-check-schema'
import { normalizeLineBreaks } from '../lib/utils'

export type SpellCheckResponse = z.infer<typeof spellCheckSchema>

const spellCheckAction = async (
  payload: CheckPayload,
): Promise<SpellCheckResponse> => {
  const start = Date.now()

  try {
    const normalizedText = normalizeLineBreaks(payload.text) // 개행 문자 정규화
    const validateCheckPayload = checkPayloadSchema.parse({
      ...payload,
      text: normalizedText,
    })

    const { data } = await SpellerApi.check(validateCheckPayload)
    const validateCheckResponse = checkResponseSchema.parse(data)

    const elapsedTimeMs = Date.now() - start

    return {
      data: {
        ...validateCheckResponse,
        requestedWithStrictMode: payload.isStrictCheck ?? false,
      },
      error: null,
      elapsedTimeMs,
    }
  } catch (error) {
    const elapsedTimeMs = Date.now() - start

    if (axios.isAxiosError(error)) {
      const serverErrorResponse = serverErrorResponseSchema.parse(
        error.response?.data,
      )
      const requestDataRaw = error.config?.data // 직렬화된 요청 데이터
      const requestData = JSON.parse(requestDataRaw)
      const parsedRequestData = checkPayloadSchema.parse(requestData)

      return {
        data: null,
        error: {
          ...serverErrorResponse,
          requestPayload: {
            isStrictCheck: parsedRequestData.isStrictCheck ?? false,
            textLength: parsedRequestData.text.length,
          },
        },
        elapsedTimeMs,
      }
    }

    return {
      data: null,
      error: {
        type: 'unknown',
        errorMessage: 'An unknown error occurred while executing a function.',
      },
      elapsedTimeMs,
    }
  }
}

export { spellCheckAction }
