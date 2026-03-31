import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Story from '../components/Story';
import HowWeServe from '../components/HowWeServe';
import FeaturedDish from '../components/FeaturedDish';
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
      <FeaturedDish />
      <CraftSection />
      <Contact />
      <OrderPanel />
    </div>
  );
};

export default LandingPage;
