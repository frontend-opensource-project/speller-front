import { checkIpAccess } from '../api/check-ip-access'
import { getClientIP } from '../api/get-client-iP'
import { AccessDeniedMessage } from '../ui/access-denied-message'

const withIPRestriction = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function IPRestrictedComponent(props: P) {
    const clientIP = await getClientIP()

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

export { withIPRestriction }
