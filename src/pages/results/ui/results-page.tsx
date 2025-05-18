import { SpellerRefsProvider } from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import { Navigator } from './navigator'
import { StrongCheckMessage } from './strong-check-message'
import { CorrectionContent } from './correction-content'
import { ResultsControl } from './results-control'
import { ErrorTrackingSection } from './error-tracking-section'
import { cn } from '@/shared/lib/tailwind-merge'

const ResultsPage = () => {
  return (
    <SpellerRefsProvider>
      <ContentLayout className='pb-8 tab:pb-[2.625rem] pc:pb-12'>
        <div className='relative mb-2 mt-[0.94rem] flex min-h-[1.625rem] items-center justify-between tab:mt-[1.75rem] tab:justify-center pc:mb-[0.78rem] pc:mt-[1.97rem] pc:min-h-8'>
          <Navigator />
          <StrongCheckMessage />
        </div>
        {/* 교정 문서 & 맞춤법/문법 오류 레이아웃*/}
        <div className='flex h-full flex-col gap-2 overflow-hidden pc:flex-row pc:gap-0'>
          {/* 교정 문서*/}
          <div className='content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg bg-white p-5 contain-strict tab:rounded-[1rem] tab:p-10 pc:w-1/2 pc:rounded-br-none pc:rounded-tr-none pc:pr-[1.25rem] pc-lg:pr-10'>
            <CorrectionContent />
            {/* 글자수 & 돌아가기, 복사하기 버튼 */}
            <ResultsControl />
          </div>
          {/* 맞춤법/문법 오류 */}
          <div
            className={cn(
              'content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg border border-blue-500 bg-white px-5 pb-3.5 pt-[1.125rem] contain-strict tab:rounded-[1rem] tab:p-10 tab:pb-7 pc:w-1/2 pc:rounded-bl-none pc:rounded-tl-none pc:border-none pc:pb-10 pc:pl-[1.25rem] pc-lg:pl-10',
              '@container',
            )}
          >
            <ErrorTrackingSection />
          </div>
        </div>
      </ContentLayout>
    </SpellerRefsProvider>
  )
}

// 0.625rem
export { ResultsPage }
