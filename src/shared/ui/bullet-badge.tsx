import { CorrectMethod } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'

interface BulletBadgeProps {
  className?: React.HTMLAttributes<HTMLElement>['className']
  method: CorrectMethod
}

const BulletBadge = ({ className, method }: BulletBadgeProps) => {
  return (
    <i
      className={cn(
        'h-2 w-2 rounded-full bg-purple-100',
        className,
        method === CorrectMethod.띄어쓰기 && 'bg-green-100',
        method === CorrectMethod.오탈자 && 'bg-red-100',
        method === CorrectMethod.문맥 && 'bg-purple-100',
      )}
    />
  )
}

export { BulletBadge }
