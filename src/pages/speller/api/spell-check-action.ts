'use server'

import axios from 'axios'
import { z, ZodError } from 'zod'

import {
  SpellerApi,
  type SpellerState,
  checkPayloadSchema,
  checkResponseSchema,
} from '@/entities/speller'

const errorResponseSchema = z.object({
  errorMessage: z.string(),
  errorCode: z.number(),
})

type ActionState = {
  data: SpellerState['response'] | null
  error:
    | null
    | {
        errorMessage: string
        type: 'zodError' | 'unknown'
      }
    | {
        errorMessage: string
        type: 'server'
        errorCode: number
        requestPayload: {
          isStrict: boolean
          textLength: number
        }
      }
  elapsedTimeMs: number
}

const spellCheckAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const start = Date.now()

  try {
    const text = formData.get('speller-text') as string
    const isStrictCheck = formData.get('isStrictCheck') === 'on'
    const validateCheckPayload = checkPayloadSchema.parse({
      text,
      isStrictCheck,
    })
    const { data } = await SpellerApi.check(validateCheckPayload)
    const validateCheckResponse = checkResponseSchema.parse(data)
    const elapsedTimeMs = Date.now() - start

    return {
      data: {
        ...validateCheckResponse,
        requestedWithStrictMode: isStrictCheck,
      },
      error: null,
      elapsedTimeMs,
    }
  } catch (error) {
    const elapsedTimeMs = Date.now() - start

    if (axios.isAxiosError(error) && error.response?.data) {
      try {
        const { errorCode, errorMessage } = errorResponseSchema.parse(
          error.response.data,
        )
        const requestDataRaw = error.config?.data // 직렬화된 요청 데이터
        const requestDataParsed = JSON.parse(requestDataRaw)
        const { text, isStrictCheck = false } =
          checkPayloadSchema.parse(requestDataParsed)

        return {
          data: null,
          error: {
            errorCode,
            errorMessage,
            type: 'server',
            requestPayload: {
              isStrict: isStrictCheck,
              textLength: text.length,
            },
          },
          elapsedTimeMs,
        }
      } catch {
        return {
          data: null,
          error: {
            errorMessage:
              "spellCheckAction: Response field value attribute and type don't match.",
            type: 'zodError',
          },
          elapsedTimeMs,
        }
      }
    }

    if (error instanceof ZodError) {
      return {
        data: null,
        error: {
          errorMessage:
            'spellCheckAction: Received invalid form field value — type or format mismatch.',
          type: 'zodError',
        },
        elapsedTimeMs,
      }
    }

    return {
      data: null,
      error: {
        errorMessage:
          'spellCheckAction: An unknown error occurred while executing a function.',
        type: 'unknown',
      },
      elapsedTimeMs,
    }
  }
}

export { spellCheckAction }
