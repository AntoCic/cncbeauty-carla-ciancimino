import { useState, useEffect } from 'react';
import FloatingNav from '../../components/FloatingNav/FloatingNav';
import SiteFooter from '../../components/SiteFooter/SiteFooter';
import WaFab from '../../components/WaFab/WaFab';
import PromoModal from '../../components/PromoModal/PromoModal';
import PromoFloatingButton from '../../components/PromoFloatingButton/PromoFloatingButton';
import { useActivePromotions } from '../../db/promotion/usePromotions';
import CherryBlossomIntro from './cmp/CherryBlossomIntro';
import HeroSection from './cmp/HeroSection';
import EntryPoints from './cmp/EntryPoints';
import WhyUs from './cmp/WhyUs';
import TechCarousel from './cmp/TechCarousel';
import AboutSection from './cmp/AboutSection';
import Testimonials from './cmp/Testimonials';
import ContactsSection from './cmp/ContactsSection';
import FaqSection from './cmp/FaqSection';

const PROMO_SEEN_KEY = 'cnc_promo_last_seen';
const PROMO_POPUP_DELAY_MS = 3000;

const Home = () => {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('cnc_intro'));
  const [heroReady, setHeroReady] = useState(() => !!sessionStorage.getItem('cnc_intro'));
  const { promotions } = useActivePromotions();
  const [showPromoModal, setShowPromoModal] = useState(false);

  useEffect(() => {
    document.title = 'CNC Beauty – Centro Estetico a Sciacca, Agrigento';
  }, []);

  useEffect(() => {
    if (promotions.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(PROMO_SEEN_KEY) === today) return;
    const timer = setTimeout(() => setShowPromoModal(true), PROMO_POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [promotions]);

  const handleIntroDone = () => {
    setShowIntro(false);
    setHeroReady(true);
  };

  const closePromoModal = () => {
    setShowPromoModal(false);
    localStorage.setItem(PROMO_SEEN_KEY, new Date().toISOString().slice(0, 10));
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
      {promotions.length > 0 && <PromoFloatingButton onClick={() => setShowPromoModal(true)} />}
      {showPromoModal && <PromoModal promotions={promotions} onClose={closePromoModal} />}
    </>
  );
};

export default Home;
