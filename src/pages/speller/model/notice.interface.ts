export interface Notice {
  /** 공지 고유 식별자 (예: "20250810-1")
   * 로컬스토리지 키로 사용됩니다.
   * 식별자가 중복될 경우, 새로운 공지가 등록되더라도 기존의 “일주일간 보지 않기” 설정에 의해 표시되지 않을 수 있습니다.
   */
  id: string

  /** 공지 제목 */
  title: string

  /** 공지 내용 (마크다운).
   * 마크다운으로 렌더되므로 링크·소제목·목록·강조를 사용할 수 있습니다.
   * 상세 페이지로 연결하려면 `[자세히 보기](/notice/<상세 id>)`처럼 링크를 인라인으로 삽입하세요.
   */
  contents: string

  /** 공지 시작일 (YYYY-MM-DD 형식) */
  startDate: string

  /** 공지 활성 여부 (false면 팝업 표시 안 함) */
  enabled: boolean

  /** "일주일간 보지 않기" 옵션 표시 여부 (false면 표시 안 함) */
  allowWeeklyDismiss: boolean
}
