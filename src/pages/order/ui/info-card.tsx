import React from 'react'

interface InfoCardProps {
  title: string
  description: React.ReactNode
}

export const InfoCard = ({ title, description }: InfoCardProps) => {
  return (
    <div className='flex flex-col gap-2 rounded-[0.5rem] bg-white px-2.5 py-3'>
      <h3 className='font-semibold leading-[1.4rem]'>{title}</h3>
      <p className='text-sm text-slate-400'>{description}</p>
    </div>
  )
}
