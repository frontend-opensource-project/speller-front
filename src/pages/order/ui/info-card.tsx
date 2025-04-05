import React from 'react'

interface InfoCardProps {
  title: string
  description: React.ReactNode
}

export const InfoCard = ({ title, description }: InfoCardProps) => {
  return (
    <div className='flex flex-col gap-2 rounded-[0.5rem] bg-white px-4 py-5'>
      <h3 className='text-[1.5rem] font-semibold leading-[2.1rem]'>{title}</h3>
      <p className='text-slate-400'>{description}</p>
    </div>
  )
}
