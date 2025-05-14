import { useCallback, useState } from 'react'

export const useAdRetryKey = (
  prefix: string,
  maxRetries: number,
): [string, number, () => void, () => void] => {
  const [retryCount, setRetryCount] = useState(0)
  const [key, setKey] = useState(() => `${prefix}-${Date.now()}`)

  const reset = useCallback(() => {
    setRetryCount(0)
    setKey(`${prefix}-${Date.now()}`)
  }, [prefix])

  const retry = useCallback(() => {
    setRetryCount(prev => {
      const next = prev + 1
      if (next <= maxRetries) {
        setKey(`${prefix}-retry-${next}-${Date.now()}`)
      }
      return next
    })
  }, [prefix, maxRetries])

  return [key, retryCount, retry, reset]
}
