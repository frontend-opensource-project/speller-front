import { ReduxProvider } from '@/app/redux/redux-provider'
import { withIpRestriction } from '@/shared/lib/with-ip-restriction'
import { BaseLayout } from '@/shared/ui/base-layout'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BaseLayout>
      <ReduxProvider>{children}</ReduxProvider>
    </BaseLayout>
  )
}

export default withIpRestriction(Layout)
