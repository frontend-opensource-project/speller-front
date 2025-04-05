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
    <section className='flex h-[628px] flex-1 flex-col rounded-[1rem] border border-[#ECEDF4] bg-[#FAFAFC] px-[2.125rem] py-[2rem]'>
      <h2 className='mb-[1.25rem] text-[3.25rem] font-bold'>{title}</h2>
      <p className='mb-[1.75rem] h-[4.25rem] text-[1.5rem] text-slate-400'>
        {description}
      </p>
      <div className='flex flex-col gap-2'>{children}</div>
    </section>
  )
}
