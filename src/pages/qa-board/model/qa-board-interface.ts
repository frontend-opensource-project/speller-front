import type {
  QaBoardDetail,
  QaBoardItem,
  QaBoardListResponse,
  QaBoardWriteInput,
} from './qa-board-schema'

export type QaBoardSearchType = 'title' | 'author' | 'content'

export interface QaBoardSearchParams {
  searchType?: QaBoardSearchType
  searchQuery?: string
}

export interface QaBoardService {
  getList(
    page: number,
    pageSize?: number,
    search?: QaBoardSearchParams,
  ): Promise<QaBoardListResponse>
  getDetail(id: number): Promise<QaBoardDetail>
  create(data: QaBoardWriteInput): Promise<QaBoardItem>
  incrementViews(id: number): Promise<void>
  createReply(
    questionId: number,
    author: string,
    content: string,
    password: string,
    step?: number,
    reLevel?: number,
  ): Promise<void>
  update(
    id: number,
    password: string,
    title: string,
    content: string,
  ): Promise<void>
  delete(id: number, password: string): Promise<void>
}

export interface QaBoardListParams {
  page?: number
  pageSize?: number
  search?: string
}
