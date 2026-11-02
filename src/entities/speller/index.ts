export { SpellerApi } from './api/speller-service'
export {
  checkText,
  CHECK_ERROR_MESSAGE,
  type CheckError,
  type CheckErrorKind,
  type CheckTextResult,
} from './api/check-text'
export { normalizeLineBreaks } from './lib/normalize-line-breaks'
export { splitPages, PAGE_THRESHOLD, type PageRange } from './lib/split-pages'
export { toUtf16ErrInfo } from './lib/server-offset'
export { extractContext } from './lib/extract-context'
export {
  getPageText,
  getCorrectedPageText,
  getCorrectedText,
  getLongProgress,
} from './lib/long-check-text'
export { getTextMethodColor, getBgMethodColor } from './lib/get-method-color'
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
export {
  startLongCheck,
  setPagesStatus,
  pageCheckSucceeded,
  pageCheckFailed,
  applyLongCorrections,
  ignoreLongErrors,
  undoLongCheck,
  selectLongError,
  resetLongCheck,
  longCheckReducer,
  errorKey,
  type LongCheckState,
  type LongPage,
  type LongPageStatus,
  type PageRef,
} from './model/long-check-slice'
export { SpellerSetting } from './ui/speller-setting'
export { BulletBadge } from './ui/bullet-badge'
export { HelpSection } from './ui/help-section'
