import { PersistGateProvider } from '@/app/redux/redux-provider'

/**
 * 첫 렌더부터 복원된 검사 상태가 있어야 동작하는 라우트용 레이아웃.
 *
 * @description
 * PersistGate 하위는 서버 HTML 본문이 비어 있으므로 색인이 필요한 페이지는
 * 이 그룹에 두지 않는다. 여기 속한 경로는 모두 noindex 다.
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <PersistGateProvider>{children}</PersistGateProvider>
}

export default Layout
