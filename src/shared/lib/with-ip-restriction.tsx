import 'server-only'

import { ServerIpGuard } from '../ui/server-ip-guard'

const isDev = process.env.NODE_ENV === 'development'

const withIpRestriction = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function IPRestrictedComponent(props: P) {
    if (isDev) {
      return <WrappedComponent {...props} />
    }

    return (
      <ServerIpGuard>
        <WrappedComponent {...props} />
      </ServerIpGuard>
    )
  }
}

export { withIpRestriction }
