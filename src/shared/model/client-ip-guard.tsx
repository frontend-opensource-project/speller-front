'use client'

import { FC, PropsWithChildren, useEffect, useState } from 'react'

import { useClientIp } from '../lib/use-client-ip'
import {
  AccessDeniedMessage,
  IpCheckingFallback,
} from '../ui/ip-access-feedback'
import { ENDPOINT } from '../config'
import { CheckIpRequest, CheckIpResponseSchema } from '../api'

export const ClientIpGuard: FC<PropsWithChildren> = ({ children }) => {
  const clientIp = useClientIp()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAccess = async () => {
      const canCheckIpAccess =
        clientIp && clientIp.isSuccess && clientIp.ip !== 'unknown'
      const isClientIpUnknown = clientIp && clientIp.ip === 'unknown'

      if (canCheckIpAccess) {
        try {
          const payload: CheckIpRequest = { clientIP: clientIp.ip }
          const response = await fetch(ENDPOINT.CHECK_IP, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          const data = await response.json()
          const parsed = CheckIpResponseSchema.safeParse(data)

          if (!parsed.success) {
            throw new Error('Invalid response schema')
          }

          setAllowed(parsed.data.allowed)
        } catch (error) {
          // TODO: GA4 이벤트 등록
          // 서버로부터 잘못된 응답이 왔을때, 콘텐츠 렌더링을 허용합니다.
          console.error('Failed to check IP access:', error)
          setAllowed(true)
        }

        return
      }

      // TODO: GA4 이벤트 등록
      // 클라이언트에서 IP를 확인할 수 없을 때, 콘텐츠 렌더링을 허용합니다.
      if (isClientIpUnknown) {
        setAllowed(true)
      }
    }

    checkAccess()
  }, [clientIp])

  if (!clientIp || allowed === null) {
    return <IpCheckingFallback />
  }

  return allowed ? children : <AccessDeniedMessage />
}
