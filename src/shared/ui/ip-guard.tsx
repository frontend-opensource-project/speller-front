'use server'

import { ReactElement } from 'react'

import { checkIpAllowed } from '../api'
import { AccessDeniedMessage } from './ip-access-feedback'
import { getClientIpByHeader } from '../lib/get-client-ip-by-header'
import { ClientIpGuard } from './client-ip-guard'

interface ServerIpGuardProps {
  children: ReactElement
}

const isDev = process.env.NODE_ENV === 'development'

const IpGuard = async ({ children }: ServerIpGuardProps) => {
  if (isDev) {
    return children
  }

  const clientIp = await getClientIpByHeader()
  const isClientIpUnknown = !clientIp.isSuccess && clientIp.ip === 'unknown'

  // 서버 헤더에서 클라이언트 IP를 확인할 수 없는 경우, 클라이언트 측에서 재조회합니다.
  if (isClientIpUnknown) {
    return <ClientIpGuard>{children}</ClientIpGuard>
  }

  try {
    const isIpAllowed = await checkIpAllowed(clientIp.ip)

    if (!isIpAllowed) {
      return <AccessDeniedMessage />
    }
  } catch (error) {
    // TODO: GA4 이벤트 등록
    // IP 확인 중 예외가 발생해도, 렌더링 흐름에는 영향을 주지 않습니다.
    console.warn(error)
  }

  return children
}

export { IpGuard }
