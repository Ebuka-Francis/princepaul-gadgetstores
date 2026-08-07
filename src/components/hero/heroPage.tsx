import React from 'react'
import HeroSlider from './hero-slider'
import TrustFeatures from './TrustFeatures'
import Container from '../layout/Container'

function HeroPage() {
  return (
   <Container className="bg-linear-to-b from-[#00289E] via-[#00289E] to-white md:bg-none">
      <HeroSlider />
      <TrustFeatures />
    </Container>
  )
}

export default HeroPage;