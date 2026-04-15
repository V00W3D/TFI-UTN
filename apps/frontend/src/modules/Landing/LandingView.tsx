/**
 * @file LandingView.tsx
 * @module Landing
 * @description Orquestador principal de la landing page pública de QART.
 */
import { useEffect } from 'react';
import Contact from '@/modules/Landing/Contact';
import CraftSection from '@/modules/Landing/CraftSection';
import { FeaturedDish } from '@/modules/Landing/FeaturedDish';
import Hero from '@/modules/Landing/Hero';
import HowWeServe from '@/modules/Landing/HowWeServe';
import FloatingActions from '@/modules/Landing/LandingView/FloatingActions';
import { Navbar } from '@/modules/Landing/Navbar';
import OrderPanel from '@/modules/Landing/OrderPanel';
import Story from '@/modules/Landing/Story';
import { useAppStore } from '@/shared/store/appStore';
import { landingStyles } from '@/styles/modules/landing';

export const LandingView = () => {
  const { setModule } = useAppStore();

  useEffect(() => {
    setModule('LANDING');
  }, [setModule]);

  return (
    <div className={landingStyles.layout}>
      <Navbar />

      <main>
        <Hero />
        <FeaturedDish />
        <Story />
        <HowWeServe />
        <CraftSection />
        <OrderPanel />
        <Contact />
      </main>

      <FloatingActions />
    </div>
  );
};

export default LandingView;
