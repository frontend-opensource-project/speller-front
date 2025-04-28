import { z } from 'zod'
import { CorrectMethodEnum } from '@/entities/speller'
import { cn } from '@/shared/lib/tailwind-merge'

interface BulletBadgeProps {
  className?: React.HTMLAttributes<HTMLElement>['className']
  method: z.infer<typeof CorrectMethodEnum>
}

const BulletBadge = ({ className, method }: BulletBadgeProps) => {
  return (
    <i
      className={cn(
        'size-2 rounded-full bg-green-100',
        className,
        method === CorrectMethodEnum.enum.띄어쓰기 && 'bg-purple-100',
        method === CorrectMethodEnum.enum.오탈자 && 'bg-red-100',
        method === CorrectMethodEnum.enum.문맥 && 'bg-green-100',
      )}
    />
  )
}

export { BulletBadge }
