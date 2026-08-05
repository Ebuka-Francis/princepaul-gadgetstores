import React from 'react'
import HeroSlider from './hero-slider'
import TrustFeatures from './TrustFeatures'
import Container from '../layout/Container'

function HeroPage() {
  return (
   <Container className="bg-linear-to-b from-[#3b82f6] via-[#bfdbfe] to-white md:bg-none">
      <HeroSlider />
      <TrustFeatures />
    </Container>
  )
}

export default HeroPage;