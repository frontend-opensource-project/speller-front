export { SpellerApi } from './api/speller-service'
export {
  applyTextMethodColor,
  applyBgMethodColor,
} from './lib/apply-method-color'
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
export {
  SpellerRefsProvider,
  useSpellerRefs,
} from './model/speller-refs-context'
export { useSpeller } from './model/use-speller'
export { spellerReducer, type SpellerState } from './model/speller-slice'
export { SpellerSetting } from './ui/speller-setting'
