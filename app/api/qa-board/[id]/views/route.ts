import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/shared/lib/db/mssql'

// POST /api/qa-board/[id]/views - 조회수 증가
export async function POST(
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

    // 조회수 증가
    const updateQuery = `
      UPDATE Board2
      SET readnum = readnum + 1
      WHERE numm = @numm
    `

    await execute(updateQuery, { numm })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('조회수 증가 오류:', error)
    return NextResponse.json(
      { error: '조회수 증가에 실패했습니다.' },
      { status: 500 },
    )
  }
}
