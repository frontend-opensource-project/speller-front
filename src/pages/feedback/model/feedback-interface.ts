import { FeedbackPayload } from './feedback-schema'

export interface FeedbackService {
  sendReportMail: (payload: FeedbackPayload) => void
}
