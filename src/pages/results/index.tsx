import { ContentLayout } from '@/shared/ui/content-layout'
import {
  CorrectionContent,
  ErrorTrackingSection,
  ResultsControl,
  StrongCheckMessage,
} from './ui'

const ResultsPage = () => {
  return (
    <ContentLayout>
      <StrongCheckMessage isStrongCheck />
      {/* 교정 문서 & 맞춤법/문법 오류 레이아웃*/}
      <div className='flex flex-col gap-[0.44rem] tab:gap-[0.5rem] pc:flex-row pc:gap-0'>
        {/* 교정 문서*/}
        <div className='flex h-full min-h-[30.5rem] w-full min-w-0 flex-1 flex-col rounded-lg bg-white p-5 tab:rounded-[1rem] tab:p-10 pc:rounded-br-none pc:rounded-tr-none'>
          <CorrectionContent />
          {/* 글자수 & 돌아가기, 복사하기 버튼 */}
          <ResultsControl count={167} />
        </div>
        {/* 맞춤법/문법 오류 */}
        <div className='flex h-full min-h-[30.5rem] w-full min-w-0 flex-1 flex-col rounded-lg border border-blue-500 bg-white p-5 tab:rounded-[1rem] tab:p-10 pc:rounded-bl-none pc:rounded-tl-none'>
          <ErrorTrackingSection />
        </div>
      </div>
      {/* 레이아웃을 위한 하단 간격 */}
      <div className='min-h-[2rem] tab:min-h-[3.13rem]' />
    </ContentLayout>
  )
}

export { ResultsPage }
