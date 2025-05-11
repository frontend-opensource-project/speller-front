import { checkIpAccess } from '../api/check-ip-access'
import { AccessDeniedMessage } from '../ui/access-denied-message'
import { getClientIp } from './get-client-ip'

const withIpRestriction = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function IPRestrictedComponent(props: P) {
    if (process.env.NODE_ENV === 'development') {
      return <WrappedComponent {...props} />
    }

    const clientIP = await getClientIp()

    try {
      if (!clientIP.isSuccess) {
        throw new Error(clientIP.reason)
      }

      const isAccessDenied = await checkIpAccess(clientIP.ip)

      return isAccessDenied ? (
        <AccessDeniedMessage />
      ) : (
        <WrappedComponent {...props} />
      )
    } catch (error) {
      console.warn(error)

      return <WrappedComponent {...props} />
    }
  }
}

export { withIpRestriction }
