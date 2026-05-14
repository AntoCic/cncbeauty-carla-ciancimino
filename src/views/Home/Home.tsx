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

const Home = () => {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('cnc_intro'));
  const [heroReady, setHeroReady] = useState(() => !!sessionStorage.getItem('cnc_intro'));

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
        <Testimonials />
        <WhyUs />
        <TechCarousel />
        <AboutSection />
        <ContactsSection />
        <FaqSection />
      </main>

      <SiteFooter />
      <WaFab />
    </>
  );
};

export default Home;
