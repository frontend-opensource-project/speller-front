'use server'

import { SpellerApi } from '@/entities/speller'
import { VersionResponse } from '@/entities/speller/model/speller-interface'

const spellCheckVersionAction = async (): Promise<VersionResponse> => {
  try {
    const { data } = await SpellerApi.version()
    return data
  } catch (error) {
    console.error('Error fetching version:', error)
    return { curVersion: '' }
  }
}

export { spellCheckVersionAction }
