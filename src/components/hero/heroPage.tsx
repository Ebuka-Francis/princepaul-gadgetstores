import React from 'react'
import HeroSlider from './hero-slider'
import TrustFeatures from './TrustFeatures'
import Container from '../layout/Container'

function HeroPage() {
  return (
    <Container className="bg-primary/5">
      <HeroSlider />
      <TrustFeatures />
    </Container>
  )
}

export default HeroPage;
