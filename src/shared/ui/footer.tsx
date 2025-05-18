import { AdProvider } from '../model/ad-context'
import { FooterAdWrapper } from './footer-ad-wrapper'
import { FooterInfoSection } from './footer-info-section'

const Footer = () => {
  return (
    <AdProvider>
      <FooterAdWrapper>
        <FooterInfoSection />
      </FooterAdWrapper>
    </AdProvider>
  )
}

export { Footer }
