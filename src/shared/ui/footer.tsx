import { cn } from '../lib/tailwind-merge'

const Footer = () => {
  return (
    <footer className={cn('bg-slate-200 px-4 py-3')}>
      <p
        className={cn(
          'text-center text-base font-bold text-slate-500 pc-lg:container pc:mx-auto',
        )}
      >
        본 페이지는 유료 사용자 전용입니다. URL 공유 및 외부 유출을 금지합니다.
      </p>
    </footer>
  )
}

export { Footer }
