import React from 'react'
import { PcGuide } from './pc-guide'
import { TabMobileGuide } from './tab-mobile-guide'

export const GuidePage = () => {
  return (
    <>
      {/*
        PC/모바일 화면이 각각 같은 제목을 보여 주지만 CSS 로 하나만 노출된다.
        문서 구조상의 제목은 여기 하나만 두어 h1 이 둘로 늘어나지 않게 한다.
      */}
      <h1 className='sr-only'>바른한글 맞춤법 검사기 사용법</h1>
      <PcGuide />
      <TabMobileGuide />
    </>
  )
}
