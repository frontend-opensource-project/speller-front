'use server'

import { redirect } from 'next/navigation'
import type { QaBoardWriteInput } from '../model/qa-board-schema'
import { QaBoardApi } from './qa-board-service'
import { verifyRecaptchaToken } from '@/shared/lib/recaptcha'

export interface QaBoardWriteActionState {
  success: boolean
  error?: string
}

export async function createQaBoardAction(
  prevState: QaBoardWriteActionState,
  formData: FormData,
): Promise<QaBoardWriteActionState> {
  // reCAPTCHA 토큰 검증
  const recaptchaToken = formData.get('recaptchaToken') as string
  const recaptchaResult = await verifyRecaptchaToken(
    recaptchaToken,
    'qa_board_create',
  )

  if (!recaptchaResult.success) {
    return {
      success: false,
      error: recaptchaResult.error || 'reCAPTCHA 검증에 실패했습니다.',
    }
  }

  // 클라이언트에서 이미 검증됨 - 서버에서는 DB 저장만 처리
  const data: QaBoardWriteInput = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  let resultId: number | null = null

  try {
    const result = await QaBoardApi.create(data)
    resultId = result.id
  } catch (error) {
    console.error('[QaBoard] DB 저장 실패:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '질문 등록에 실패했습니다.',
    }
  }

  redirect(`/qa-board/${resultId}`)
}

// reCAPTCHA 검증 (검색용)
export async function verifyRecaptchaAction(
  token: string,
  action: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await verifyRecaptchaToken(token, action)
  return { success: result.success, error: result.error }
}

// 답변 등록
export async function replyQaBoardAction(
  questionId: number,
  author: string,
  content: string,
  password: string,
  step: number = 1,
  reLevel: number = 1,
): Promise<QaBoardWriteActionState> {
  try {
    await QaBoardApi.createReply(
      questionId,
      author,
      content,
      password,
      step,
      reLevel,
    )
    return { success: true }
  } catch (error) {
    console.error('[QaBoard] 답변 등록 실패:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '답변 등록에 실패했습니다.',
    }
  }
}

// 질문 수정
export async function updateQaBoardAction(
  id: number,
  password: string,
  title: string,
  content: string,
): Promise<QaBoardWriteActionState> {
  try {
    await QaBoardApi.update(id, password, title, content)
    return { success: true }
  } catch (error) {
    console.error('[QaBoard] 수정 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '수정에 실패했습니다.',
    }
  }
}

// 질문 삭제
export async function deleteQaBoardAction(
  id: number,
  password: string,
): Promise<QaBoardWriteActionState> {
  try {
    await QaBoardApi.delete(id, password)
    return { success: true }
  } catch (error) {
    console.error('[QaBoard] 삭제 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '삭제에 실패했습니다.',
    }
  }
}
