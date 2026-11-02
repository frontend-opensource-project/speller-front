import { cn } from '@/shared/lib/tailwind-merge'

// 버튼 옆에 함께 적는 단축키
const Kbd = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <kbd
    aria-hidden
    className={cn(
      'inline-flex shrink-0 items-center justify-center rounded border border-slate-300 px-[5px] font-sans text-[11px] font-medium leading-[1.5] text-slate-400 dark:border-dark-border dark:text-dark-subtle',
      className,
    )}
  >
    {children}
  </kbd>
)

// macOS면 ⌘, 그 밖에는 Ctrl
const modKeyLabel = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
    ? '⌘'
    : 'Ctrl'

export { Kbd, modKeyLabel }
