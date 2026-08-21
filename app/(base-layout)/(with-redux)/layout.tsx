import { ReduxProvider } from '@/app/redux/redux-provider'

/**
 * 맞춤법 검사 상태(Redux)가 필요한 라우트용 레이아웃.
 *
 * @description
 * 스토어만 제공하고 세션 복원은 기다리지 않으므로, 하위 페이지는 정상적으로
 * 서버 렌더링된다.
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ReduxProvider>{children}</ReduxProvider>
}

export default Layout
