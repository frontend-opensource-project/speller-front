import type { QaBoardService } from '../model/qa-board-interface'
import type {
  QaBoardDetail,
  QaBoardItem,
  QaBoardListResponse,
  QaBoardWriteInput,
} from '../model/qa-board-schema'

class QaBoardApiService implements QaBoardService {
  async getList(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<QaBoardListResponse> {
    const response = await fetch(
      `/api/qa-board?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('목록 조회에 실패했습니다.')
    }

    return await response.json()
  }

  async getDetail(id: number): Promise<QaBoardDetail> {
    const response = await fetch(`/api/qa-board/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Q&A를 찾을 수 없습니다.')
    }

    return await response.json()
  }

  async create(data: QaBoardWriteInput): Promise<QaBoardItem> {
    const response = await fetch('/api/qa-board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('질문 등록에 실패했습니다.')
    }

    return await response.json()
  }

  async incrementViews(id: number): Promise<void> {
    const response = await fetch(`/api/qa-board/${id}/views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('조회수 증가에 실패했습니다.')
    }
  }
}

export const QaBoardApi = new QaBoardApiService()
