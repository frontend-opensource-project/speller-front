import { ContentLayout } from '@/shared/ui/content-layout'
import { ScrollContainer } from '@/shared/ui/scroll-container'
import { Skeleton } from '@/shared/ui/skeleton'

const ResultsSkeleton = () => {
  return (
    <ContentLayout className='pb-4 tab:pb-10 pc:pb-5'>
      <div className='flex min-h-[1.625rem] items-center justify-end bg-background pb-2 pt-4 tab:-top-3 tab:pt-[1.25rem] pc:relative pc:top-0 pc:min-h-8 pc:pb-3 pc:pt-6'>
        <Skeleton className='h-6 w-40 rounded-md pc:h-7' />
      </div>
      <div className='flex h-full flex-col gap-2 overflow-hidden pc:flex-row pc:gap-0'>
        <div className='content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg bg-white p-4 contain-strict tab:rounded-[1rem] tab:p-5 pc:w-1/2 pc:rounded-br-none pc:rounded-tr-none pc:p-6'>
          <div className='mb-[1rem] flex justify-between tab:mb-[1.25rem]'>
            <Skeleton className='h-7 w-16 rounded-md tab:h-8 tab:w-20' />
          </div>
          <div className='min-w-0 flex-1'>
            <Skeleton className='h-full flex-1 rounded-md' />
          </div>
          <div className='flex flex-shrink-0 justify-between pt-5'>
            <Skeleton className='h-5 w-8 self-end rounded-md tab:h-6 tab:w-10 pc:self-center' />
            <div className='flex gap-3'>
              <Skeleton className='tab:h-13 tab:w-15 h-12 w-14 rounded-md' />
              <Skeleton className='tab:h-13 tab:w-15 h-12 w-14 rounded-md' />
              <Skeleton className='tab:h-13 tab:w-15 h-12 w-14 rounded-md' />
              <Skeleton className='tab:h-13 tab:w-15 h-12 w-14 rounded-md' />
            </div>
          </div>
        </div>
        <div className='content-visibility-auto flex min-h-[30.5rem] flex-col rounded-lg border border-blue-500 bg-white p-4 contain-strict tab:rounded-[1rem] tab:p-5 pc:w-1/2 pc:rounded-bl-none pc:rounded-tl-none pc:border-none pc:p-6'>
          <div className='pb-[1.125rem]'>
            <Skeleton className='h-7 w-32 rounded-md tab:h-8 tab:w-40' />
          </div>
          <ScrollContainer className='-mt-[1.125rem]'>
            <div className='my-[1.125rem]'>
              <Skeleton className='h-52 w-full rounded-md' />
            </div>
            <div className='my-[1.125rem]'>
              <Skeleton className='h-52 w-full rounded-md' />
            </div>
            <div className='my-[1.125rem]'>
              <Skeleton className='h-52 w-full rounded-md' />
            </div>
          </ScrollContainer>
          <div className='mt-10 gap-4'>
            <Skeleton className='h-7 w-72 rounded-md tab:h-8 tab:w-80' />
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

export { ResultsSkeleton }
