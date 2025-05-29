import { SpellerRefsProvider } from '@/entities/speller'
import { ContentLayout } from '@/shared/ui/content-layout'
import { Navigator } from './navigator'
import { StrongCheckMessage } from './strong-check-message'
import { CorrectionContent } from './correction-content'
import { ResultsControl } from './results-control'
import { ErrorTrackingSection } from './error-tracking-section'
const ResultsPage = () => {
  return (
    <ContentLayout className='pb-8 tab:pb-[2.625rem] pc:pb-12'>
      <SpellerRefsProvider>
        <div className='sticky -top-2 z-10 flex min-h-[1.625rem] items-center justify-between bg-background pb-2 pt-4 tab:-top-4 tab:justify-center tab:pt-[1.75rem] pc:relative pc:top-0 pc:min-h-8 pc:pb-3 pc:pt-8'>
          <Navigator />
          <StrongCheckMessage />
        </div>
        {/* 교정 문서 & 맞춤법/문법 오류 레이아웃*/}
        <div className='flex flex-col gap-2 overflow-auto pc:flex-row pc:gap-0'>
          {/* 교정 문서*/}
          <div className='flex max-h-[30.5rem] min-h-[30.5rem] w-full flex-1 flex-col rounded-lg bg-white p-5 tab:rounded-[1rem] tab:p-10 pc:max-h-[40.25rem] pc:w-1/2 pc:flex-none pc:rounded-br-none pc:rounded-tr-none'>
            <CorrectionContent />
            {/* 글자수 & 돌아가기, 복사하기 버튼 */}
            <ResultsControl />
          </div>
          {/* 맞춤법/문법 오류 */}
          <div className='flex max-h-[30.5rem] min-h-[30.5rem] w-full flex-1 flex-col rounded-lg border border-blue-500 bg-white px-5 pb-3.5 pt-[1.125rem] tab:rounded-[1rem] tab:p-10 tab:pb-7 pc:max-h-[40.25rem] pc:w-1/2 pc:flex-none pc:rounded-bl-none pc:rounded-tl-none pc:border-none pc:pb-10'>
            <ErrorTrackingSection />
          </div>
        </div>
      </SpellerRefsProvider>
    </ContentLayout>
  )
}

export { ResultsPage }
