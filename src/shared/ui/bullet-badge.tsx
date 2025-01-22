import { type CorrectMethod } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'

interface BulletBadgeProps {
  className?: React.HTMLAttributes<HTMLElement>['className']
  method: CorrectMethod
}

const BulletBadge = ({ className, method }: BulletBadgeProps) => {
  return (
    <i
      className={cn(
        'h-2 w-2 rounded-full',
        className,
        method === 1 && 'bg-green-100',
        method === 2 && 'bg-red-100',
        method >= 3 && 'bg-purple-100',
      )}
    ></i>
  )
}

export { BulletBadge }
