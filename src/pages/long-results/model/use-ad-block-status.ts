'use client'

import { useEffect, useState } from 'react'

type AdBlockStatus = 'pending' | 'blocked' | 'clear'

// adblock-detect-react와 같은 방법으로 확인한다
const PROBE_URL = 'https://www3.doubleclick.net'
// 응답이 오지 않으면 차단하지 않은 것으로 본다 (adblock-detect-react도 감지하지 못한다)
const TIMEOUT_MS = 3000

/**
 * 광고 차단 여부. adblock-detect-react의 useDetectAdBlock은 확인 중과 차단 안 함을
 * 구분하지 못하므로, 확인이 끝나기 전에 구간 검사를 시작하지 않도록 따로 둔다.
 */
const useAdBlockStatus = () => {
  const [status, setStatus] = useState<AdBlockStatus>('pending')

  useEffect(() => {
    let done = false
    const settle = (next: AdBlockStatus) => {
      if (done) return
      done = true
      setStatus(next)
    }
    const timer = setTimeout(() => settle('clear'), TIMEOUT_MS)
    fetch(PROBE_URL, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
      .then(({ redirected }) => settle(redirected ? 'blocked' : 'clear'))
      .catch(() => settle('blocked'))
    return () => {
      done = true
      clearTimeout(timer)
    }
  }, [])

  return status
}

export { useAdBlockStatus, type AdBlockStatus }
