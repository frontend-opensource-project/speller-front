import { ContentLayout } from '@/shared/ui/content-layout'
import { ScrollContainer } from '@/shared/ui/scroll-container'
import { Skeleton } from '@/shared/ui/skeleton'

const ResultsSkeleton = () => {
  return (
    <ContentLayout className='pb-8 tab:pb-[2.625rem] pc:pb-12'>
      <div className='mb-2 mt-[0.94rem] flex min-h-[1.625rem] items-center justify-end tab:mt-[1.75rem] pc:mb-[0.78rem] pc:mt-[1.97rem] pc:min-h-8'>
        <Skeleton className='h-6 w-56 rounded-sm pc:h-[1.875rem] pc:w-64' />
      </div>
      <div className='flex h-full flex-col gap-2 overflow-hidden pc:flex-row pc:gap-0'>
        <div className='content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg bg-white p-5 contain-strict tab:rounded-[1rem] tab:p-10 pc:w-1/2 pc:rounded-br-none pc:rounded-tr-none'>
          <div className='mb-[1rem] flex justify-between tab:mb-[1.25rem]'>
            <Skeleton className='h-7 w-16 rounded-sm tab:h-8 tab:w-20' />
          </div>
          <div className='min-w-0 flex-1'>
            <Skeleton className='h-full flex-1 rounded-sm' />
          </div>
          <div className='mt-2 flex flex-shrink-0 justify-between'>
            <Skeleton className='h-5 w-8 self-end rounded-sm tab:h-6 tab:w-9' />
            <div className='flex gap-3'>
              <Skeleton className='tab:h-13 tab:w-15 h-12 w-14 rounded-sm' />
              <Skeleton className='tab:h-13 tab:w-15 h-12 w-14 rounded-sm' />
            </div>
          </div>
        </div>
        <div className='content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg border border-blue-500 bg-white px-5 pb-3.5 pt-[1.125rem] contain-strict tab:rounded-[1rem] tab:p-10 tab:pb-7 pc:w-1/2 pc:rounded-bl-none pc:rounded-tl-none pc:border-none pc:pb-10'>
          <div className='pb-[1.125rem]'>
            <Skeleton className='h-7 w-44 rounded-sm tab:h-8 tab:w-48' />
          </div>
          <ScrollContainer className='-mt-[1.125rem]'>
            <div className='my-[1.125rem]'>
              <Skeleton className='h-52 w-full rounded-sm' />
            </div>
            <div className='my-[1.125rem]'>
              <Skeleton className='h-52 w-full rounded-sm' />
            </div>
            <div className='my-[1.125rem]'>
              <Skeleton className='h-52 w-full rounded-sm' />
            </div>
          </ScrollContainer>
          <div className='mt-5 gap-4'>
            <Skeleton className='h-6 w-72 rounded-sm tab:h-7 tab:w-80' />
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

export { ResultsSkeleton }
