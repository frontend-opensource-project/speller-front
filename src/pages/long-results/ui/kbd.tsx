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
      'ml-1.5 inline-flex min-w-5 items-center justify-center rounded border border-current px-1 font-sans text-xs font-normal leading-4 opacity-60',
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
