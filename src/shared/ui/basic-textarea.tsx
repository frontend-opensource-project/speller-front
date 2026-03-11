import * as React from 'react'

import { cn } from '@/shared/lib/tailwind-merge'

const BasicTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'md:text-sm flex min-h-[80px] w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-elevated',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
BasicTextarea.displayName = 'BasicTextarea'

export { BasicTextarea }
