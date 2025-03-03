import { checkIpAccess } from '../api/checkIpAccess'
import { getClientIP } from '../api/getClientIP'
import { AccessDeniedMessage } from '../ui/access-denied-message'

const withIPRestriction = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function IPRestrictedComponent(props: P) {
    if (process.env.NODE_ENV === 'development') {
      return <WrappedComponent {...props} />
    }

    try {
      const clientIP = await getClientIP()
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
