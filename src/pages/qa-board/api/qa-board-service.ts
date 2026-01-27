import he from 'he'
import { query, execute } from '@/shared/lib/db/mssql'
import type {
  QaBoardSearchParams,
  QaBoardService,
} from '../model/qa-board-interface'
import type {
  Board2Record,
  QaBoardAnswer,
  QaBoardDetail,
  QaBoardItem,
  QaBoardListResponse,
  QaBoardWriteInput,
} from '../model/qa-board-schema'

/**
 * 현재 날짜/시간을 한국식 표기법으로 변환
 * 예: "2026-01-17 오전 8:49:12"
 */
function formatKoreanDateTime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = now.getHours()
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const ampm = hours < 12 ? '오전' : '오후'
  const displayHour = hours % 12 || 12

  return `${year}-${month}-${day} ${ampm} ${displayHour}:${minutes}:${seconds}`
}

/**
 * DB에서 읽어온 content 디코딩
 * 1. HTML Entity 디코딩 (&lt; → <)
 *    - 이중 인코딩된 경우도 처리 (&amp;#8203; → &#8203; → 실제 문자)
 * 2. <br> 태그를 줄바꿈으로 변환
 */
function decodeContent(content: string): string {
  if (!content) return ''
  // 이중 인코딩 처리: 더 이상 변화가 없을 때까지 디코딩 반복 (최대 3회)
  let decoded = content
  for (let i = 0; i < 3; i++) {
    const next = he.decode(decoded)
    if (next === decoded) break
    decoded = next
  }
  // <br> 태그를 줄바꿈으로 변환
  return decoded.replace(/<br\s*\/?>/gi, '\n')
}

/**
 * DB에서 읽어온 텍스트 필드 디코딩 (title 등)
 * HTML Entity 디코딩만 수행 (<br> 변환 없음)
 * 이중 인코딩된 경우도 처리
 */
function decodeText(text: string): string {
  if (!text) return ''
  // 이중 인코딩 처리: 더 이상 변화가 없을 때까지 디코딩 반복 (최대 3회)
  let decoded = text
  for (let i = 0; i < 3; i++) {
    const next = he.decode(decoded)
    if (next === decoded) break
    decoded = next
  }
  return decoded
}

/**
 * DB에 저장할 content 인코딩
 * 1. 줄바꿈을 <br>로 변환
 * 2. HTML Entity 인코딩 (< → &lt;)
 */
function encodeContent(content: string): string {
  if (!content) return ''
  // 줄바꿈을 <br>로 변환 후 HTML Entity 인코딩
  const withBr = content.replace(/\r\n/g, '\n').replace(/\n/g, '<br>')
  return he.encode(withBr, { useNamedReferences: true })
}

class QaBoardApiService implements QaBoardService {
  async getList(
    page: number = 1,
    pageSize: number = 10,
    search?: QaBoardSearchParams,
  ): Promise<QaBoardListResponse> {
    const offset = (page - 1) * pageSize

    // 검색 조건 생성
    let searchCondition = ''
    const searchParams: Record<string, unknown> = {}

    if (search?.searchQuery && search?.searchType) {
      const searchQuery = `%${search.searchQuery}%`
      searchParams.searchQuery = searchQuery

      switch (search.searchType) {
        case 'title':
          searchCondition = ' AND b.title LIKE @searchQuery'
          break
        case 'author':
          searchCondition = ' AND b.name LIKE @searchQuery'
          break
        case 'content':
          // 질문 내용 또는 해당 질문의 답변 내용에서 검색
          searchCondition = ` AND (
            CAST(b.content AS NVARCHAR(MAX)) LIKE @searchQuery
            OR EXISTS (
              SELECT 1 FROM Board2 ans
              WHERE ans.ref = b.numm AND ans.numm != b.numm
              AND CAST(ans.content AS NVARCHAR(MAX)) LIKE @searchQuery
            )
          )`
          break
      }
    }

    // 전체 질문 개수 (답글 제외, ref = numm인 것만)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Board2 b
      WHERE b.ref = b.numm${searchCondition}
    `
    const countResult = await query<{ total: number }>(countQuery, searchParams)
    const total = countResult[0]?.total || 0

    // 질문 목록 조회 (최신순, 답글 제외)
    const listQuery = `
      SELECT
        b.numm,
        b.fldinx,
        b.name,
        b.title,
        b.mail,
        b.url,
        b.writeday,
        b.pwd,
        b.ref,
        b.step,
        b.re_level,
        b.readnum,
        CAST(b.content AS NVARCHAR(MAX)) as content,
        (SELECT COUNT(*) FROM Board2 WHERE ref = b.numm AND ref != numm) as answerCount
      FROM Board2 b
      WHERE b.ref = b.numm${searchCondition}
      ORDER BY b.numm DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `

    const items = await query<Board2Record & { answerCount: number }>(
      listQuery,
      {
        offset,
        pageSize,
        ...searchParams,
      },
    )

    return {
      items: items.map(item => ({
        id: item.numm,
        displayId: item.fldinx,
        title: decodeText(item.title),
        content: decodeContent(item.content), // HTML Entity 디코딩 + <br> → 줄바꿈
        author: item.name,
        email: item.mail,
        createdAt: item.writeday, // 그대로 사용 (이미 한국식 표기)
        status:
          item.answerCount > 0 ? ('answered' as const) : ('pending' as const),
        views: item.readnum,
        answerCount: item.answerCount || 0,
        isAnswer: false,
        parentId: null,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  async getDetail(id: number): Promise<QaBoardDetail> {
    // 질문 조회
    const detailQuery = `
      SELECT
        numm,
        fldinx,
        name,
        title,
        mail,
        writeday,
        readnum,
        ref,
        CAST(content AS NVARCHAR(MAX)) as content
      FROM Board2
      WHERE numm = @id
    `

    const result = await query<Board2Record>(detailQuery, { id })

    if (result.length === 0) {
      throw new Error('Q&A를 찾을 수 없습니다.')
    }

    const item = result[0]

    // 답변 조회 (ref가 질문의 numm을 가리키고, 자기 자신이 아닌 것)
    const answerQuery = `
      SELECT
        numm,
        name,
        writeday,
        step,
        re_level,
        ref,
        CAST(content AS NVARCHAR(MAX)) as content
      FROM Board2
      WHERE ref = @id AND numm != @id
      ORDER BY step ASC, numm ASC
    `

    const answerResults = await query<{
      numm: number
      name: string
      writeday: string
      step: number
      re_level: number
      ref: number
      content: string
    }>(answerQuery, { id })

    const answers: QaBoardAnswer[] = answerResults.map(a => ({
      id: a.numm,
      content: decodeContent(a.content),
      author: a.name,
      createdAt: a.writeday,
      step: a.step,
      reLevel: a.re_level,
      ref: a.ref,
    }))

    return {
      id: item.numm,
      displayId: item.fldinx,
      title: decodeText(item.title),
      content: decodeContent(item.content),
      author: item.name,
      email: item.mail,
      createdAt: item.writeday,
      status: answers.length > 0 ? ('answered' as const) : ('pending' as const),
      views: item.readnum,
      answerCount: answers.length,
      isAnswer: false,
      parentId: null,
      answers,
    }
  }

  async create(data: QaBoardWriteInput): Promise<QaBoardItem> {
    // 새 numm 생성 (현재 최대값 + 1)
    const maxNummQuery = `SELECT ISNULL(MAX(numm), 0) + 1 as nextNumm FROM Board2`
    const maxNummResult = await query<{ nextNumm: number }>(maxNummQuery)
    const nextNumm = maxNummResult[0].nextNumm

    // 현재 날짜/시간을 한국식 표기법으로 변환
    const writeday = formatKoreanDateTime()

    // content 인코딩 (줄바꿈 → <br>, HTML Entity 인코딩)
    const encodedContent = encodeContent(data.content)

    // INSERT 쿼리 (fldinx는 DB에서 자동 증가)
    const insertQuery = `
      INSERT INTO Board2 (
        name, title, mail, url, writeday, pwd,
        ref, step, re_level, readnum, numm, content
      ) VALUES (
        @name, @title, @mail, @url, @writeday, @pwd,
        @ref, @step, @re_level, @readnum, @numm, @content
      )
    `

    await execute(insertQuery, {
      name: data.author,
      title: data.title,
      mail: data.email || '',
      url: null,
      writeday,
      pwd: data.password,
      ref: nextNumm, // 새 글이므로 자기 자신을 참조
      step: 0,
      re_level: 0,
      readnum: 0,
      numm: nextNumm,
      content: encodedContent,
    })

    return {
      id: nextNumm,
      displayId: 0, // fldinx는 DB에서 자동 생성되므로 임시값
      title: data.title,
      content: data.content, // 응답은 원본 그대로
      author: data.author,
      email: data.email || '',
      createdAt: writeday,
      status: 'pending' as const,
      views: 0,
      answerCount: 0,
      isAnswer: false,
      parentId: null,
    }
  }

  async incrementViews(id: number): Promise<void> {
    const updateQuery = `
      UPDATE Board2
      SET readnum = readnum + 1
      WHERE numm = @id
    `
    await execute(updateQuery, { id })
  }

  async createReply(
    questionId: number,
    author: string,
    content: string,
    password: string,
    step: number = 1,
    reLevel: number = 1,
  ): Promise<void> {
    // 새 numm 생성 (현재 최대값 + 1)
    const maxNummQuery = `SELECT ISNULL(MAX(numm), 0) + 1 as nextNumm FROM Board2`
    const maxNummResult = await query<{ nextNumm: number }>(maxNummQuery)
    const nextNumm = maxNummResult[0].nextNumm

    // 현재 날짜/시간을 한국식 표기법으로 변환
    const writeday = formatKoreanDateTime()

    // content 인코딩
    const encodedContent = encodeContent(content)

    // 답변 INSERT (ref는 질문의 numm을 가리킴)
    const insertQuery = `
      INSERT INTO Board2 (
        name, title, mail, url, writeday, pwd,
        ref, step, re_level, readnum, numm, content
      ) VALUES (
        @name, @title, @mail, @url, @writeday, @pwd,
        @ref, @step, @re_level, @readnum, @numm, @content
      )
    `

    await execute(insertQuery, {
      name: author,
      title: 'RE:', // 답변 제목
      mail: '',
      url: null,
      writeday,
      pwd: password,
      ref: questionId, // 질문을 참조
      step,
      re_level: reLevel,
      readnum: 0,
      numm: nextNumm,
      content: encodedContent,
    })
  }

  async update(
    id: number,
    password: string,
    title: string,
    content: string,
  ): Promise<void> {
    // 비밀번호 확인
    const checkQuery = `
      SELECT pwd FROM Board2 WHERE numm = @id
    `
    const result = await query<{ pwd: string }>(checkQuery, { id })

    if (result.length === 0) {
      throw new Error('질문을 찾을 수 없습니다.')
    }

    if (result[0].pwd !== password) {
      throw new Error('비밀번호가 일치하지 않습니다.')
    }

    // content 인코딩
    const encodedContent = encodeContent(content)

    // 수정
    const updateQuery = `
      UPDATE Board2
      SET title = @title, content = @content
      WHERE numm = @id
    `

    await execute(updateQuery, { id, title, content: encodedContent })
  }

  async delete(id: number, password: string): Promise<void> {
    // 비밀번호 확인
    const checkQuery = `
      SELECT pwd FROM Board2 WHERE numm = @id
    `
    const result = await query<{ pwd: string }>(checkQuery, { id })

    if (result.length === 0) {
      throw new Error('질문을 찾을 수 없습니다.')
    }

    if (result[0].pwd !== password) {
      throw new Error('비밀번호가 일치하지 않습니다.')
    }

    // 답변도 함께 삭제 (ref가 해당 질문을 가리키는 것들)
    const deleteAnswersQuery = `
      DELETE FROM Board2 WHERE ref = @id AND numm != @id
    `
    await execute(deleteAnswersQuery, { id })

    // 질문 삭제
    const deleteQuery = `
      DELETE FROM Board2 WHERE numm = @id
    `
    await execute(deleteQuery, { id })
  }
}

export const QaBoardApi = new QaBoardApiService()
