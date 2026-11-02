import { PersistConfig, createTransform } from 'redux-persist'
import type { LongCheckState } from '@/entities/speller'
import { createNoopStorage } from '@/shared/lib/create-noop-storage'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('session')
    : createNoopStorage()

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: storage,
  whitelist: ['speller'],
}

// 요청 중이던 구간은 새로고침하면 응답을 받을 수 없으므로 대기 상태로 저장한다
const pendingPagesTransform = createTransform<
  LongCheckState['pages'],
  LongCheckState['pages']
>(
  pages =>
    pages.map(page =>
      page.status === 'queued' || page.status === 'loading'
        ? { ...page, status: 'idle' }
        : page,
    ),
  pages => pages,
  { whitelist: ['pages'] },
)

// 긴글 모드는 원고가 길어 교정할 때마다 전체를 직렬화하지 않도록 1초 간격으로 묶어 쓴다
const longCheckPersistConfig: PersistConfig<LongCheckState> = {
  key: 'longCheck',
  storage: storage,
  throttle: 1000,
  blacklist: ['undoStack'],
  transforms: [pendingPagesTransform],
}

export { persistConfig, longCheckPersistConfig }
