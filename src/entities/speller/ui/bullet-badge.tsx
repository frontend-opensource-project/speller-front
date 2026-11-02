import { z } from 'zod'
import { getBgMethodColor } from '../lib/get-method-color'
import { CorrectMethodEnum } from '../model/speller-schema'
import { cn } from '@/shared/lib/tailwind-merge'

interface BulletBadgeProps {
  className?: React.HTMLAttributes<HTMLElement>['className']
  method: z.infer<typeof CorrectMethodEnum>
}

const BulletBadge = ({ className, method }: BulletBadgeProps) => {
  return (
    <i
      className={cn(
        'size-2 rounded-full',
        `${getBgMethodColor(method)}`,
        className,
      )}
    />
  )
}

export { BulletBadge }
