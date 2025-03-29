export { SpellerApi } from './api/speller-service'
export { parseCandidateWords } from './lib/parse-candidate-words'
export type {
  UserReplacePayload,
  NotChangePayload,
} from './model/speller-interface'
export {
  CorrectMethodEnum,
  checkPayloadSchema,
  checkResponseSchema,
  clickReplacePayloadSchema,
  type ErrorInfo,
  type CorrectInfo,
  type CheckPayload,
  type CheckResponse,
  type ClickReplacePayload,
} from './model/speller-schema'
export { useSpeller } from './model/use-speller'
export {
  SpellerRefsProvider,
  useSpellerRefs,
} from './model/speller-refs-context'
export { spellerReducer, type SpellerState } from './model/speller-slice'
export { SpellerSetting } from './ui/speller-setting'
