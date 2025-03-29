import { headers } from 'next/headers'
import { checkIpAccess } from '../api/check-ip-access'
import { AccessDeniedMessage } from '../ui/access-denied-message'

const withIpRestriction = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function IPRestrictedComponent(props: P) {
    const clientIP = await getClientIp()

    if (process.env.NODE_ENV === 'development') {
      return <WrappedComponent {...props} />
    }

    try {
      const isAccessDenied = await checkIpAccess(clientIP)

      return isAccessDenied ? (
        <AccessDeniedMessage />
      ) : (
        <WrappedComponent {...props} />
      )
    } catch (error) {
      console.error(error)

      return <WrappedComponent {...props} />
    }
  }
}

const getClientIp = async () => {
  'use server'
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get('x-forwarded-for')
  const realIp = requestHeaders.get('x-real-ip')

  let clientIP: string

  // 프록시/로드 밸런서 환경 고려
  if (forwardedFor) {
    // 여러 IP가 있을 경우 첫 번째(가장 왼쪽) IP를 선택
    clientIP = forwardedFor.split(',')[0].trim()
  } else if (realIp) {
    // x-real-ip 헤더가 있는 경우 (Nginx 등에서 설정)
    clientIP = realIp
  } else {
    // 기본값
    clientIP = '127.0.0.1'
  }

  // IPv6 매핑된 IPv4 주소 처리 (::ffff:127.0.0.1 형식)
  const ipv4Pattern = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/
  const match =
    typeof clientIP === 'string' ? clientIP.match(ipv4Pattern) : null
  const ip = match ? match[1] : clientIP

  return ip
}

export { withIpRestriction }
