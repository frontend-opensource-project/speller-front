import { FC } from 'react'
import { cn } from '../lib/tailwind-merge'

interface TextCounterProps {
  count: number
  className?: string
}

const TextCounter: FC<TextCounterProps> = ({ count, className }) => {
  return (
    <p
      className={cn(
        'self-end text-[0.875rem] font-medium leading-[1.75rem] tracking-[-0.0175rem] text-slate-300 dark:text-dark-border pc:text-[1.125rem] pc:leading-[1.75rem] pc:tracking-[-0.0225rem]',
        className,
      )}
    >
      {count}자
    </p>
  )
}

export { TextCounter }
