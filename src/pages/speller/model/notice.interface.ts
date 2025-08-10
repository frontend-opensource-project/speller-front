export interface Notice {
  /** 공지 고유 식별자 (예: "20250810-1")
   * 로컬스토리지 키로 사용됩니다.
   * 식별자가 중복될 경우, 새로운 공지가 등록되더라도 기존의 “일주일간 보지 않기” 설정에 의해 표시되지 않을 수 있습니다.
   */
  id: string

  /** 공지 제목 */
  title: string

  /** 공지 내용. 각 요소는 p 태그로 구분됩니다. */
  contents: string

  /** 공지 시작일 (YYYY-MM-DD 형식) */
  startDate: string

  /** 공지 활성 여부 (false면 팝업 표시 안 함) */
  enabled: boolean

  /** "일주일간 보지 않기" 옵션 표시 여부 (false면 표시 안 함) */
  allowWeeklyDismiss: boolean
}
