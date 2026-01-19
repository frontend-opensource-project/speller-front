import type {
  QaBoardDetail,
  QaBoardItem,
  QaBoardListResponse,
  QaBoardWriteInput,
} from './qa-board-schema'

export interface QaBoardService {
  getList(page: number, pageSize?: number): Promise<QaBoardListResponse>
  getDetail(id: number): Promise<QaBoardDetail>
  create(data: QaBoardWriteInput): Promise<QaBoardItem>
  incrementViews(id: number): Promise<void>
}

export interface QaBoardListParams {
  page?: number
  pageSize?: number
  search?: string
}
