import { CorrectedErrorType } from '@/shared/lib/analytics-event-types'
import { CorrectMethod } from '../model/speller-schema'

const correctMethodToErrorTypeMap: Record<CorrectMethod, CorrectedErrorType> = {
  [CorrectMethod.띄어쓰기]: 'spacing',
  [CorrectMethod.오탈자]: 'typo',
  [CorrectMethod.문맥]: 'context',
}

export const getCorrectedErrorType = (method: number): CorrectedErrorType => {
  return correctMethodToErrorTypeMap[method as CorrectMethod] ?? 'context'
}
