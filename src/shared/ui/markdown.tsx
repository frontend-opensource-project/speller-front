import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkCjkFriendly from 'remark-cjk-friendly'
import type { Components } from 'react-markdown'
import { cn } from '@/shared/lib/tailwind-merge'

const linkClass = 'font-semibold text-primary hover:underline'

/**
 * 마크다운을 사이트 테마에 맞춰 렌더하는 재사용 컴포넌트.
 *
 * @description
 * - 각 요소를 기존 slate/dark 토큰과 about-page 타이포 스케일에 매핑한다.
 * - react-markdown 기본 설정은 원시 HTML을 렌더하지 않으므로 작성자 마크다운이 XSS에 안전하다.
 * - 훅이 없는 isomorphic 컴포넌트라 서버 컴포넌트(공지 상세 페이지)와
 *   클라이언트 컴포넌트(공지 팝업) 양쪽에서 동일하게 동작한다.
 */
const staticComponents: Components = {
  h2: ({ children }) => (
    <h2 className='text-slate-900 mt-8 text-xl font-bold first:mt-0 dark:text-white tab:text-2xl'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='text-slate-900 mt-6 text-lg font-bold first:mt-0 dark:text-white'>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className='text-slate-700 my-3 leading-[170%] first:mt-0 dark:text-dark-text'>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className='text-slate-700 my-3 list-disc space-y-1 pl-5 dark:text-dark-text'>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className='text-slate-700 my-3 list-decimal space-y-1 pl-5 dark:text-dark-text'>
      {children}
    </ol>
  ),
  strong: ({ children }) => (
    <strong className='text-slate-900 font-bold dark:text-white'>
      {children}
    </strong>
  ),
  hr: () => <hr className='my-6 border-slate-200 dark:border-dark-border' />,
  blockquote: ({ children }) => (
    <blockquote className='my-4 border-l-4 border-slate-200 pl-4 text-slate-500 dark:border-dark-border dark:text-dark-subtle'>
      {children}
    </blockquote>
  ),
}

/**
 * 링크 렌더러를 생성한다.
 * - 내부 링크(/로 시작): next/link로 basePath 자동 적용. newTab이면 새 탭으로 연다.
 * - 외부 링크: 항상 새 탭.
 */
function makeComponents(newTab: boolean): Components {
  return {
    ...staticComponents,
    a: ({ href = '', children }) => {
      const isInternal = href.startsWith('/')
      if (isInternal) {
        return (
          <Link
            href={href}
            className={linkClass}
            {...(newTab
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {children}
          </Link>
        )
      }
      return (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
        >
          {children}
        </a>
      )
    },
  }
}

interface MarkdownProps {
  children: string
  className?: string
  /** 링크를 새 탭에서 열지 여부 (기본값 false: 내부 링크는 같은 탭). */
  newTab?: boolean
}

export function Markdown({
  children,
  className,
  newTab = false,
}: MarkdownProps) {
  return (
    <div className={cn('text-base tab:text-lg', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCjkFriendly]}
        components={makeComponents(newTab)}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
