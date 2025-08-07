import { AxiosResponse } from 'axios'

import { Client } from '@/shared/api'
import { ENDPOINT } from '@/shared/config'
import {
  NotChangePayload,
  SpellerService,
  UserReplacePayload,
  VersionResponse,
} from '../model/speller-interface'
import {
  CheckPayload,
  CheckResponse,
  ClickReplacePayload,
} from '../model/speller-schema'

class SpellerApiService implements SpellerService {
  readonly #client: Client

  constructor() {
    this.#client = Client.Instance
  }

  async check(payload: CheckPayload): Promise<AxiosResponse<CheckResponse>> {
    return this.#client.post(ENDPOINT.CHECK, payload)
  }

  async logUserReplace(payload: UserReplacePayload) {
    return this.#client.post(ENDPOINT.USER_REPLACE, payload)
  }

  async logClickReplace(payload: ClickReplacePayload) {
    return this.#client.post(ENDPOINT.CLICK_REPLACE, payload)
  }

  async notChange(payload: NotChangePayload) {
    return this.#client.post(ENDPOINT.NOT_CHANGE, payload)
  }

  async version(): Promise<AxiosResponse<VersionResponse>> {
    return this.#client.post(ENDPOINT.VERSION)
  }
}

const SpellerApi = new SpellerApiService()

export { SpellerApi }
