import { useState, useEffect } from 'react';
import FloatingNav from '../../components/FloatingNav/FloatingNav';
import SiteFooter from '../../components/SiteFooter/SiteFooter';
import WaFab from '../../components/WaFab/WaFab';
import CherryBlossomIntro from './cmp/CherryBlossomIntro';
import HeroSection from './cmp/HeroSection';
import EntryPoints from './cmp/EntryPoints';
import WhyUs from './cmp/WhyUs';
import TechCarousel from './cmp/TechCarousel';
import AboutSection from './cmp/AboutSection';
import Testimonials from './cmp/Testimonials';
import ContactsSection from './cmp/ContactsSection';
import FaqSection from './cmp/FaqSection';

const alreadySeen = !!sessionStorage.getItem('cnc_intro');

const Home = () => {
  const [showIntro, setShowIntro]       = useState(!alreadySeen);
  const [heroReady, setHeroReady]       = useState(alreadySeen);

  useEffect(() => {
    document.title = 'CNC Beauty – Centro Estetico a Sciacca, Agrigento';
  }, []);

  const handleIntroDone = () => {
    setShowIntro(false);
    setHeroReady(true);
  };

  return (
    <>
      {showIntro && <CherryBlossomIntro onDone={handleIntroDone} />}

      <FloatingNav />

      <main>
        <HeroSection animate={heroReady} />
        <EntryPoints />
        <WhyUs />
        <TechCarousel />
        <AboutSection />
        <Testimonials />
        <ContactsSection />
        <FaqSection />
      </main>

      <SiteFooter />
      <WaFab />
    </>
  );
};

export default Home;
