import { type CorrectMethod, CorrectMethodEnum } from '../model/speller-schema'

export const getTextMethodColor = (method: CorrectMethod) => {
  switch (method) {
    case CorrectMethodEnum.enum.어법:
      return 'text-red-100'
    case CorrectMethodEnum.enum.문맥:
      return 'text-green-100'
    case CorrectMethodEnum.enum.분석실패:
      return 'text-blue-400'
    default:
      return 'text-blue-400'
  }
}

export const getBgMethodColor = (method: CorrectMethod) => {
  switch (method) {
    case CorrectMethodEnum.enum.어법:
      return 'bg-red-100'
    case CorrectMethodEnum.enum.문맥:
      return 'bg-green-100'
    case CorrectMethodEnum.enum.분석실패:
      return 'bg-blue-400'
    default:
      return 'bg-blue-400'
  }
}
