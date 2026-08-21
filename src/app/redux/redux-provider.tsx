'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from './store'

/**
 * Redux 스토어만 제공한다.
 *
 * @description
 * 세션 복원을 기다리지 않으므로 하위 페이지가 정상적으로 서버 렌더링된다.
 * 복원된 값이 필요한 컴포넌트는 `usePersistRehydrated` 로 복원 완료 시점을 잡는다.
 */
const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>
}

/**
 * 세션 복원이 끝날 때까지 children 렌더링을 보류한다.
 *
 * @description
 * 첫 렌더부터 복원된 상태가 있어야 동작하는 페이지(예: 검사 결과가 없으면
 * 다른 경로로 보내는 화면)에만 사용한다.
 * 복원은 브라우저에서만 일어나므로 이 컴포넌트 하위는 서버 HTML 이 비어 있다.
 * 따라서 검색 색인이 필요한 페이지에는 쓰지 않는다.
 */
const PersistGateProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  )
}

export { ReduxProvider, PersistGateProvider }
