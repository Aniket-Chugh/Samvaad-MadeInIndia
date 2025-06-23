import React from 'react'
import Navbar from '../components/NavBar'
import HeroSection from '../components/HeroSection'
import Features from '../components/Feature'
import WhyChooseUs from '../components/WhyChooseUs'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div>

    <Navbar></Navbar>
    <HeroSection></HeroSection>
    <Features></Features>
    <WhyChooseUs></WhyChooseUs>
    <Footer></Footer>
    </div>
  )
}

export default HomePage
