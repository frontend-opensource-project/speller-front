import React from 'react'

interface SectionPanelProps {
  title: string
  description: React.ReactNode
  children: React.ReactNode
}

export const SectionPanel = ({
  title,
  description,
  children,
}: SectionPanelProps) => {
  return (
    <section className='flex flex-1 flex-col rounded-[1rem] border border-[#ECEDF4] bg-[#FAFAFC] p-5 pc:min-h-[24.5rem]'>
      <h2 className='mb-2 text-xl font-semibold pc:text-[1.5rem]'>{title}</h2>
      <p className='mb-6 text-sm text-slate-400 pc:h-[2.75rem] pc:text-base'>
        {description}
      </p>
      <div className='flex flex-col gap-1'>{children}</div>
    </section>
  )
}
