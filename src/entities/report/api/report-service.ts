import { Client } from '@/shared/api'
import { ENDPOINT } from '@/shared/config'
import { BugReportPayload, ReportService } from '../model/report-interface'

class ReportApiService implements ReportService {
  readonly #client: Client

  constructor() {
    this.#client = Client.Instance
  }

  async sendReport(payload: BugReportPayload) {
    return this.#client.post(ENDPOINT.BUG_REPORT, payload)
  }
}

const ReportApi = new ReportApiService()

export { ReportApi }
