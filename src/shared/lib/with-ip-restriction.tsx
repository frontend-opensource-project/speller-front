import 'server-only'

import { getClientIpByHeader } from './get-client-ip-by-header'
import { ClientIpGuard } from '../model/client-ip-guard'
import { AccessDeniedMessage } from '../ui/ip-access-feedback'
import { checkIpAllowed } from '../api'

const isDev = process.env.NODE_ENV === 'development'

const withIpRestriction = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function IPRestrictedComponent(props: P) {
    if (isDev) {
      return <WrappedComponent {...props} />
    }

    const clientIp = await getClientIpByHeader()
    const isClientIpUnknown = !clientIp.isSuccess && clientIp.ip === 'unknown'

    // 서버 헤더에서 클라이언트 IP를 확인할 수 없는 경우, 클라이언트 측에서 재조회합니다.
    if (isClientIpUnknown) {
      return (
        <ClientIpGuard>
          <WrappedComponent {...props} />
        </ClientIpGuard>
      )
    }

    try {
      const isIpAllowed = await checkIpAllowed(clientIp.ip)

      return isIpAllowed ? (
        <WrappedComponent {...props} />
      ) : (
        <AccessDeniedMessage />
      )
    } catch (error) {
      console.warn(error)

      return <WrappedComponent {...props} />
    }
  }
}

export { withIpRestriction }
