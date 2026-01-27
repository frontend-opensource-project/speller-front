'use client'

import { useEffect, useCallback, useState } from 'react'
import { loadRecaptchaScript, executeRecaptcha } from './index'

export function useRecaptcha() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRecaptchaScript()
      .then(() => setIsReady(true))
      .catch(err => setError(err.message))
  }, [])

  const execute = useCallback(async (action: string): Promise<string> => {
    try {
      return await executeRecaptcha(action)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'reCAPTCHA 실행에 실패했습니다.'
      setError(message)
      throw err
    }
  }, [])

  return { isReady, error, execute }
}
