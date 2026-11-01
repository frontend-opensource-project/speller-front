import { spellerReducer, longCheckReducer } from '@/entities/speller'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { longCheckPersistConfig } from './persist-config'

const rootReducer = combineReducers({
  speller: spellerReducer,
  // root 설정의 whitelist에 넣지 않고 따로 저장한다
  longCheck: persistReducer(longCheckPersistConfig, longCheckReducer),
})

export { rootReducer }
