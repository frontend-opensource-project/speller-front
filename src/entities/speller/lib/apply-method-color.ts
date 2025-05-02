import { type CorrectMethod, CorrectMethodEnum } from '../model/speller-schema'

export const applyMethodColor = (method: CorrectMethod) => {
  switch (method) {
    case CorrectMethodEnum.enum.띄어쓰기:
      return 'purple-100'
    case CorrectMethodEnum.enum.오탈자:
      return 'red-100'
    case CorrectMethodEnum.enum.문맥:
      return 'green-100'
    default:
      return 'green-100'
  }
}
