import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Story from '../components/Story';
import HowWeServe from '../components/HowWeServe';
import FeaturedSpotlight from '../components/FeaturedSpotlight';
import CraftSection from '../components/CraftSection';
import Contact from '../components/Contact';
import OrderPanel from '../components/OrderPanel';
import { useAppStore } from '../../../appStore';
import '../LandingPages.css';

/**
 * @file LandingPage.tsx
 * @description Clean, symmetric landing page assembly.
 */
const LandingPage = () => {
  const { setModule } = useAppStore();

  useEffect(() => {
    setModule('LANDING');
  }, [setModule]);

  return (
    <div className="min-h-screen bg-qart-bg overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowWeServe />
      <Story />
      <FeaturedSpotlight />
      <CraftSection />
      <Contact />
      <OrderPanel />
    </div>
  );
};

export default LandingPage;
