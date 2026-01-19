'use server'

import { redirect } from 'next/navigation'
import type { QaBoardWriteInput } from '../model/qa-board-schema'
import { qaBoardWriteSchema } from '../model/qa-board-schema'
import { QaBoardApi } from './qa-board-service'

export interface QaBoardWriteActionState {
  success: boolean
  error?: string
  errors?: {
    title?: string[]
    content?: string[]
    author?: string[]
    email?: string[]
    password?: string[]
  }
}

export async function createQaBoardAction(
  prevState: QaBoardWriteActionState,
  formData: FormData,
): Promise<QaBoardWriteActionState> {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    author: formData.get('author'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // Zod 검증
  const validation = qaBoardWriteSchema.safeParse(rawData)

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    }
  }

  try {
    const result = await QaBoardApi.create(validation.data as QaBoardWriteInput)
    redirect(`/qa-board/${result.id}`)
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '질문 등록에 실패했습니다.',
    }
  }
}
