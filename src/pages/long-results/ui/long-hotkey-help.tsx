'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/dialog'
import { modKeyLabel } from './kbd'

interface LongHotkeyHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const rows = (mod: string): [string[], string][] => [
  [['→', '↓'], '다음 오류 (검사한 끝이면 다음 구간 검사)'],
  [['←', '↑'], '이전 오류'],
  [['Enter', '2'], '1순위 대치어로 수정'],
  [['1'], '무시'],
  [['3'], '같은 오류 모두 무시'],
  [['4'], '같은 오류 모두 수정 (문맥상 오류는 한 번 더 눌러 확인)'],
  [['5'], '직접 수정'],
  [['Esc'], '직접 수정 닫기 → 정보창 닫기 → 선택 해제'],
  [[`${mod} + Z`], '되돌리기'],
  [[`${mod} + ⇧ + C`], '교정문 전체 복사'],
  [['?'], '이 도움말'],
]

/** 긴글 모드 단축키 도움말 */
const LongHotkeyHelp = ({ open, onOpenChange }: LongHotkeyHelpProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className='max-w-md rounded-2xl'>
      <DialogTitle>단축키</DialogTitle>
      <DialogDescription>
        글자를 입력하는 칸 밖에서 쓸 수 있습니다. 한글 입력 중에는 동작하지
        않습니다.
      </DialogDescription>
      <table className='w-full text-base'>
        <tbody>
          {rows(modKeyLabel()).map(([keys, label]) => (
            <tr
              key={label}
              className='border-t border-slate-200 dark:border-dark-border'
            >
              <td className='whitespace-nowrap py-1.5 pr-4'>
                {keys.map(key => (
                  <kbd
                    key={key}
                    className='mr-1 rounded border border-slate-300 px-1.5 font-sans text-sm dark:border-dark-border'
                  >
                    {key}
                  </kbd>
                ))}
              </td>
              <td className='py-1.5'>{label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DialogContent>
  </Dialog>
)

export { LongHotkeyHelp }
