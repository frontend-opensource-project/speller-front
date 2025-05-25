import Image from 'next/image'

import { ContentLayout } from './content-layout'
import { SubmittedSuccessMessage } from './submitted-success-message'
import { SubmittedContent } from './submitted-content'
import { SubmittedControl } from './submitted-control'
import submittedMobileImage from '../../../../public/submitted_mobile.png'
import submittedTabImage from '../../../../public/submitted_tab.png'
import submittedWebImage from '../../../../public/submitted_web.png'

const SubmittedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ content: string }>
}) => {
  const { content } = await searchParams

  return (
    <ContentLayout className='px-0 tab:px-0 pc:grid-cols-[1fr_35.8rem]'>
      {/* 제출 완료 이미지 */}
      <Image
        src={submittedMobileImage}
        alt='submitted_mobile'
        sizes='100vw'
        className='h-auto w-full bg-background tab:hidden pc:hidden'
      />
      <Image
        src={submittedTabImage}
        alt='submitted_tab'
        sizes='100vw'
        className='hidden h-auto w-full bg-background tab:block pc:hidden'
      />
      <Image
        src={submittedWebImage}
        alt='submitted_web'
        sizes='100vw'
        className='hidden h-auto w-full self-center bg-background pc:block pc:rounded-sm pc-lg:rounded-none'
      />
      <div className='-mt-28 space-y-7 px-4 tab:-mt-28 tab:space-y-8 tab:px-[3.75rem] pc:-mt-0 pc:max-w-[36.25rem] pc:space-y-0 pc:px-0 pc:pl-[2.25rem] pc:pt-[6.125rem]'>
        {/* 의견 제출 성공 메시지 */}
        <SubmittedSuccessMessage />
        {/* 발송된 문의 내용   */}
        <SubmittedContent data={content} />
        {/* 다시 제출, 홈 이동 버튼 */}
        <SubmittedControl />
      </div>
    </ContentLayout>
  )
}
export { SubmittedPage }
