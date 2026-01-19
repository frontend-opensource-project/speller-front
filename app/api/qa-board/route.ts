import { NextRequest, NextResponse } from 'next/server'
import { query, execute } from '@/shared/lib/db/mssql'
import type { Board2Record } from '@/pages/qa-board/model/qa-board-schema'

// GET /api/qa-board - 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const offset = (page - 1) * pageSize

    // 전체 질문 개수 (답글 제외, ref = numm인 것만)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Board2
      WHERE ref = numm
    `
    const countResult = await query<{ total: number }>(countQuery)
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
      WHERE b.ref = b.numm
      ORDER BY b.numm DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `

    const items = await query<Board2Record & { answerCount: number }>(
      listQuery,
      {
        offset,
        pageSize,
      },
    )

    // 응답 데이터 변환
    const response = {
      items: items.map(item => ({
        id: item.numm,
        displayId: item.fldinx,
        title: item.title,
        content: item.content,
        author: item.name,
        email: item.mail,
        createdAt: item.writeday,
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

    return NextResponse.json(response)
  } catch (error) {
    console.error('Q&A 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '목록 조회에 실패했습니다.' },
      { status: 500 },
    )
  }
}

// POST /api/qa-board - 질문 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, author, email, password } = body

    // 새 fldinx 생성 (현재 최대값 + 1)
    const maxFldQuery = `SELECT ISNULL(MAX(fldinx), 0) + 1 as nextFldinx FROM Board2`
    const maxFldResult = await query<{ nextFldinx: number }>(maxFldQuery)
    const nextFldinx = maxFldResult[0].nextFldinx

    // 새 numm 생성 (현재 최대값 + 1)
    const maxNummQuery = `SELECT ISNULL(MAX(numm), 0) + 1 as nextNumm FROM Board2`
    const maxNummResult = await query<{ nextNumm: number }>(maxNummQuery)
    const nextNumm = maxNummResult[0].nextNumm

    // 현재 날짜/시간
    const now = new Date()
    const writeday = now
      .toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\. /g, '-')
      .replace(/\./g, '')

    // INSERT 쿼리
    const insertQuery = `
      INSERT INTO Board2 (
        fldinx, name, title, mail, url, writeday, pwd,
        ref, step, re_level, readnum, numm, content
      ) VALUES (
        @fldinx, @name, @title, @mail, @url, @writeday, @pwd,
        @ref, @step, @re_level, @readnum, @numm, @content
      )
    `

    await execute(insertQuery, {
      fldinx: nextFldinx,
      name: author,
      title,
      mail: email || null,
      url: null,
      writeday,
      pwd: password,
      ref: nextNumm, // 새 글이므로 자기 자신을 참조
      step: 0,
      re_level: 0,
      readnum: 0,
      numm: nextNumm,
      content,
    })

    return NextResponse.json({
      id: nextNumm,
      displayId: nextFldinx,
      title,
      content,
      author,
      email,
      createdAt: writeday,
      status: 'pending' as const,
      views: 0,
      answerCount: 0,
      isAnswer: false,
      parentId: null,
    })
  } catch (error) {
    console.error('Q&A 작성 오류:', error)
    return NextResponse.json(
      { error: '질문 작성에 실패했습니다.' },
      { status: 500 },
    )
  }
}
