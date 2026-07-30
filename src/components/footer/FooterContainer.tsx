import React from 'react';
import Container from '../layout/Container';
import FooterBanner from './FooterBanner';
import Footer from './Footer';

function FooterContainer() {
  return (
    <Container className="bg-primary"> 
        <FooterBanner />
      <Footer />
    </Container>
  )
}

export default FooterContainer