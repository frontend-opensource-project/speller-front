'use client'

import { useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

/** persistReducer 가 루트에 덧붙이는 메타 상태 */
type PersistedRootState = RootState & {
  _persist?: { rehydrated: boolean }
}

/**
 * redux-persist 의 세션 스토리지 복원이 끝났는지 여부.
 *
 * @description
 * 서버와 클라이언트의 첫 렌더에서는 항상 false 이므로 하이드레이션 불일치가 없다.
 * PersistGate 로 렌더링 자체를 막는 대신, 복원된 값이 필요한 시점에만 이 값을 쓰면
 * 페이지를 서버에서 렌더링할 수 있다.
 */
export const usePersistRehydrated = () =>
  useSelector(
    (state: PersistedRootState) => state._persist?.rehydrated ?? false,
  )
