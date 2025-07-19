import { ReduxProvider } from '@/app/redux/redux-provider'
import { BaseLayout } from '@/shared/ui/base-layout'
import { IpGuard } from '@/shared/ui/ip-guard'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <IpGuard>
      <BaseLayout>
        <ReduxProvider>{children}</ReduxProvider>
      </BaseLayout>
    </IpGuard>
  )
}

export default Layout
