import { Client } from '@/shared/api'
import { ENDPOINT } from '@/shared/config'
import { FeedbackService } from '../model/feedback-interface'
import { FeedbackPayload } from '../model/feedback-schema'

class FeedbackApiService implements FeedbackService {
  readonly #client: Client

  constructor() {
    this.#client = Client.Instance
  }

  async sendReportMail(payload: FeedbackPayload) {
    return this.#client.post(ENDPOINT.SEND_REPORT_MAIL, payload)
  }
}

const FeedbackApi = new FeedbackApiService()

export { FeedbackApi }
