import { CONTACT_INFO } from '@/shared/model/contact-info'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

export const ContactInfo = () => {
  return (
    <div className='flex gap-2 text-slate-600'>
      <span className='text-xs font-semibold leading-[1.0425rem] tracking-[-0.015rem] tab:leading-[1.05rem] pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'>
        <Link href='/order' className='hover:text-primary hover:underline'>
          구매문의
        </Link>
      </span>
      <a
        href={`tel:${CONTACT_INFO.tel.value}`}
        className='flex items-center gap-1 text-[0.6875rem] leading-[0.95563rem] tracking-[-0.01375rem] tab:leading-[0.9625rem] pc:text-[0.75rem] pc:leading-[1.035rem] pc:tracking-[-0.015rem]'
      >
        <div className='relative size-[0.83038rem]'>
          <Image
            className='object-cover'
            src='/call.svg'
            alt='call logo'
            fill
          />
        </div>
        <span>{CONTACT_INFO.tel.label}</span>
      </a>
      <a
        href={`mailto:${CONTACT_INFO.email.value}`}
        className='flex items-center gap-1 text-[0.6875rem] leading-[0.95563rem] tracking-[-0.01375rem] tab:leading-[0.9625rem]'
      >
        <div className='relative mb-[0.05rem] size-[0.83038rem]'>
          <Image
            className='object-cover'
            src='/email.svg'
            alt='email logo'
            fill
          />
        </div>
        <span>{CONTACT_INFO.email.label}</span>
      </a>
    </div>
  )
}
