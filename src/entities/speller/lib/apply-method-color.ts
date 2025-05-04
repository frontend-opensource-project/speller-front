import { type CorrectMethod, CorrectMethodEnum } from '../model/speller-schema'

export const applyTextMethodColor = (method: CorrectMethod) => {
  switch (method) {
    case CorrectMethodEnum.enum.띄어쓰기:
      return 'text-purple-100'
    case CorrectMethodEnum.enum.오탈자:
      return 'text-red-100'
    case CorrectMethodEnum.enum.문맥:
      return 'text-green-100'
    default:
      return 'text-green-100'
  }
}

export const applyBgMethodColor = (method: CorrectMethod) => {
  switch (method) {
    case CorrectMethodEnum.enum.띄어쓰기:
      return 'bg-purple-100'
    case CorrectMethodEnum.enum.오탈자:
      return 'bg-red-100'
    case CorrectMethodEnum.enum.문맥:
      return 'bg-green-100'
    default:
      return 'bg-green-100'
  }
}
