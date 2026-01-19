import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/shared/lib/db/mssql'
import type { Board2Record } from '@/pages/qa-board/model/qa-board-schema'

// GET /api/qa-board/[id] - 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const numm = parseInt(id)

    if (isNaN(numm)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID입니다.' },
        { status: 400 },
      )
    }

    // 질문 조회
    const detailQuery = `
      SELECT
        numm,
        fldinx,
        name,
        title,
        mail,
        url,
        writeday,
        pwd,
        ref,
        step,
        re_level,
        readnum,
        CAST(content AS NVARCHAR(MAX)) as content
      FROM Board2
      WHERE numm = @numm
    `

    const items = await query<Board2Record>(detailQuery, { numm })

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Q&A를 찾을 수 없습니다.' },
        { status: 404 },
      )
    }

    const item = items[0]

    // 답글 조회 (ref가 현재 numm이고, 자기 자신이 아닌 것)
    const answerQuery = `
      SELECT TOP 1
        numm,
        name,
        writeday,
        CAST(content AS NVARCHAR(MAX)) as content
      FROM Board2
      WHERE ref = @numm AND numm != @numm
      ORDER BY numm DESC
    `

    const answers = await query<{
      numm: number
      name: string
      writeday: string
      content: string
    }>(answerQuery, { numm })

    const answer =
      answers.length > 0
        ? {
            id: answers[0].numm,
            content: answers[0].content,
            author: answers[0].name,
            createdAt: answers[0].writeday,
          }
        : null

    // 답변 개수 조회
    const countQuery = `
      SELECT COUNT(*) as answerCount
      FROM Board2
      WHERE ref = @numm AND numm != @numm
    `
    const countResult = await query<{ answerCount: number }>(countQuery, {
      numm,
    })
    const answerCount = countResult[0]?.answerCount || 0

    const response = {
      id: item.numm,
      displayId: item.fldinx,
      title: item.title,
      content: item.content,
      author: item.name,
      email: item.mail,
      createdAt: item.writeday,
      status: answerCount > 0 ? ('answered' as const) : ('pending' as const),
      views: item.readnum,
      answerCount,
      isAnswer: item.ref !== item.numm,
      parentId: item.ref !== item.numm ? item.ref : null,
      answer,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Q&A 상세 조회 오류:', error)
    return NextResponse.json(
      { error: '상세 조회에 실패했습니다.' },
      { status: 500 },
    )
  }
}
