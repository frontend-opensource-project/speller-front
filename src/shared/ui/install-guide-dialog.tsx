'use client'

import { ReactNode } from 'react'
import { Copy, Ellipsis, ExternalLink, Share, SquarePlus } from 'lucide-react'
import { useClipboard } from '@frontend-opensource/use-react-hooks'

import { toast } from '@/shared/lib/use-toast'
import type {
  InstallEnvironment,
  IosBrowser,
} from '@/shared/lib/get-install-environment'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog'

type GuideEnvironment = Extract<
  InstallEnvironment,
  { type: 'ios' | 'macos-safari' | 'in-app' }
>

/** 안내 문구 사이에 화면의 버튼 모양을 그대로 보여 주는 아이콘 */
const InlineIcon = ({ children }: { children: ReactNode }) => (
  <span className='mx-0.5 inline-flex size-6 translate-y-1.5 items-center justify-center rounded-md bg-slate-100 text-primary dark:bg-dark-elevated [&>svg]:size-4'>
    {children}
  </span>
)

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className='font-semibold text-slate-600 dark:text-dark-text'>
    {children}
  </strong>
)

const ADD_TO_HOME_SCREEN = (
  <>
    <InlineIcon>
      <SquarePlus />
    </InlineIcon>{' '}
    <Strong>홈 화면에 추가</Strong>를 누릅니다. 보이지 않으면 목록을 아래로
    내리거나 <Strong>더 보기</Strong>에서 찾아 주세요.
  </>
)

const IOS_STEPS: Record<IosBrowser, ReactNode[]> = {
  'safari-26': [
    <>
      주소창 옆의{' '}
      <InlineIcon>
        <Ellipsis />
      </InlineIcon>{' '}
      버튼을 누른 뒤{' '}
      <InlineIcon>
        <Share />
      </InlineIcon>{' '}
      <Strong>공유</Strong>를 선택합니다.
    </>,
    ADD_TO_HOME_SCREEN,
    <>
      <Strong>웹 앱으로 열기</Strong>가 켜져 있는지 확인하고{' '}
      <Strong>추가</Strong>를 누릅니다.
    </>,
  ],
  safari: [
    <>
      화면 아래(iPad 는 위)의{' '}
      <InlineIcon>
        <Share />
      </InlineIcon>{' '}
      <Strong>공유</Strong> 버튼을 누릅니다.
    </>,
    ADD_TO_HOME_SCREEN,
    <>
      오른쪽 위의 <Strong>추가</Strong>를 누릅니다.
    </>,
  ],
  chrome: [
    <>
      주소창 오른쪽의{' '}
      <InlineIcon>
        <Share />
      </InlineIcon>{' '}
      <Strong>공유</Strong> 버튼을 누릅니다.
    </>,
    ADD_TO_HOME_SCREEN,
    <>
      <Strong>추가</Strong>를 누릅니다.
    </>,
  ],
  other: [
    <>
      브라우저 메뉴에서{' '}
      <InlineIcon>
        <Share />
      </InlineIcon>{' '}
      <Strong>공유</Strong>를 누릅니다.
    </>,
    ADD_TO_HOME_SCREEN,
    <>
      <Strong>추가</Strong>를 누릅니다.
    </>,
  ],
}

const MACOS_SAFARI_STEPS: ReactNode[] = [
  <>
    화면 맨 위 메뉴 막대에서 <Strong>파일</Strong>을 누릅니다. 도구 막대의{' '}
    <InlineIcon>
      <Share />
    </InlineIcon>{' '}
    <Strong>공유</Strong> 버튼을 눌러도 됩니다.
  </>,
  <>
    <Strong>Dock에 추가</Strong>를 누릅니다.
  </>,
  <>
    <Strong>추가</Strong>를 누릅니다.
  </>,
]

interface StepGuideProps {
  title: string
  description: string
  steps: ReactNode[]
  footnote: string
}

/** 번호를 매긴 단계별 설치 안내 */
const StepGuide = ({ title, description, steps, footnote }: StepGuideProps) => (
  <>
    <DialogTitle className='text-xl leading-snug tracking-tight'>
      {title}
    </DialogTitle>
    <DialogDescription className='sr-only'>{description}</DialogDescription>
    <ol className='space-y-4'>
      {steps.map((step, index) => (
        <li key={index} className='flex gap-3'>
          <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white'>
            {index + 1}
          </span>
          <p className='leading-[1.9] text-slate-500 dark:text-dark-subtle'>
            {step}
          </p>
        </li>
      ))}
    </ol>
    <p className='text-sm text-slate-400 dark:text-dark-subtle'>{footnote}</p>
  </>
)

const InAppGuide = ({ app }: { app: 'kakaotalk' | 'other' }) => {
  const { copyText } = useClipboard()

  const handleOpenExternal = () => {
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(window.location.href)}`
  }

  const handleCopy = () => {
    copyText(window.location.href)
    toast({
      description: '주소를 복사했습니다.\n브라우저 주소창에 붙여넣어 주세요.',
    })
  }

  return (
    <>
      <DialogTitle className='text-xl leading-snug tracking-tight'>
        브라우저에서 열어 주세요
      </DialogTitle>
      <DialogDescription className='leading-[1.7] text-slate-500 dark:text-dark-subtle'>
        앱 안에서 열린 화면에서는 홈 화면에 추가할 수 없습니다. Safari 나 Chrome
        같은 브라우저에서 바른한글을 연 뒤, 설치 버튼을 다시 눌러 주세요.
        {app === 'other' && (
          <>
            {' '}
            화면 위나 아래의 메뉴에서 <Strong>다른 브라우저로 열기</Strong>를
            선택하면 됩니다.
          </>
        )}
      </DialogDescription>
      <div className='flex flex-col gap-2'>
        {app === 'kakaotalk' && (
          <button
            type='button'
            className={classes.primaryButton}
            onClick={handleOpenExternal}
          >
            <ExternalLink className='size-4' />
            브라우저로 열기
          </button>
        )}
        <button
          type='button'
          className={
            app === 'kakaotalk'
              ? classes.secondaryButton
              : classes.primaryButton
          }
          onClick={handleCopy}
        >
          <Copy className='size-4' />
          주소 복사
        </button>
      </div>
    </>
  )
}

interface InstallGuideDialogProps {
  environment: GuideEnvironment
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * 브라우저 설치 창을 띄울 수 없는 환경에서 설치 방법을 알려 주는 다이얼로그.
 * - iOS: 공유 메뉴의 '홈 화면에 추가' 단계 안내
 * - macOS Safari: '파일 > Dock에 추가' 단계 안내
 * - 인앱 브라우저: 외부 브라우저로 여는 방법 안내
 */
const InstallGuideDialog = ({
  environment,
  open,
  onOpenChange,
}: InstallGuideDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className='max-w-[22rem] gap-5 break-keep rounded-xl border-none bg-white px-5 pb-6 pt-5 dark:bg-dark-surface'>
      {environment.type === 'ios' && (
        <StepGuide
          title='홈 화면에 바른한글 추가하기'
          description='공유 메뉴의 홈 화면에 추가로 바른한글을 앱처럼 설치하는 방법'
          steps={IOS_STEPS[environment.browser]}
          footnote='추가한 뒤에는 홈 화면의 바른한글 아이콘으로 실행하세요.'
        />
      )}
      {environment.type === 'macos-safari' && (
        <StepGuide
          title='Dock에 바른한글 추가하기'
          description='Safari 의 Dock에 추가로 바른한글을 앱처럼 설치하는 방법'
          steps={MACOS_SAFARI_STEPS}
          footnote='추가한 뒤에는 Dock 이나 응용 프로그램 폴더의 바른한글 아이콘으로 실행하세요.'
        />
      )}
      {environment.type === 'in-app' && <InAppGuide app={environment.app} />}
    </DialogContent>
  </Dialog>
)

const classes = {
  primaryButton:
    'flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white',
  secondaryButton:
    'flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 font-semibold text-slate-600 dark:border-dark-border dark:text-dark-text',
}

export { InstallGuideDialog }
