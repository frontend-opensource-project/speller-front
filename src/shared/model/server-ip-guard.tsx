'use server'

import { ReactElement } from 'react'

import { checkIpAllowed, ClientIpResult } from '../api'
import { AccessDeniedMessage } from '../ui/ip-access-feedback'

interface ServerIpGuardProps {
  clientIp: ClientIpResult
  children: ReactElement
}

const ServerIpGuard = async ({ clientIp, children }: ServerIpGuardProps) => {
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

export { ServerIpGuard }
