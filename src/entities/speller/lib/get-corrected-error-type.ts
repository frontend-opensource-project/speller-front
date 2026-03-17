import { CorrectedErrorType } from '@/shared/lib/analytics-event-types'
import { CorrectMethod } from '../model/speller-schema'

const correctMethodToErrorTypeMap: Record<CorrectMethod, CorrectedErrorType> = {
  [CorrectMethod.어법]: 'grammar',
  [CorrectMethod.문맥]: 'context',
  [CorrectMethod.분석실패]: 'fail',
  [CorrectMethod.흔한실수]: 'common_mistake',
}

export const getCorrectedErrorType = (method: number): CorrectedErrorType => {
  return correctMethodToErrorTypeMap[method as CorrectMethod] ?? 'fail'
}
