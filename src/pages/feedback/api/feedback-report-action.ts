'use server'

import axios from 'axios'
import { ZodError } from 'zod'
import { FeedbackApi } from './feedback-service'
import { feedbackPayloadSchema } from '../model/feedback-schema'

type ActionState = {
  data: string | null
  error: string | null
}

const feedbackReportAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const content = formData.get('feedback-text')
    const validateFeedbackPayload = feedbackPayloadSchema.parse({ content })
    await FeedbackApi.sendReportMail(validateFeedbackPayload)

    return {
      data: validateFeedbackPayload.content,
      error: null,
    }
  } catch (error) {
    let errorMessage: string =
      '[Error] feedbackReportAction: 함수를 실행하던 동안 에러가 발생했습니다.'

    if (axios.isAxiosError(error)) {
      errorMessage = error.message
    }

    if (error instanceof ZodError) {
      errorMessage = error.message
    }

    return {
      data: null,
      error: errorMessage,
    }
  }
}

export { feedbackReportAction }
