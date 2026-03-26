import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Story from '../components/Story';
import FeaturedDish from '../components/FeaturedDish';
import CraftSection from '../components/CraftSection';
import Contact from '../components/Contact';
import { useAppStore } from '../../../appStore';
import '../LandingPages.css';

/**
 * @file LandingPage.tsx
 * @description Clean, symmetric landing page assembly.
 */
const LandingPage = () => {
  const { setModule } = useAppStore();

  useEffect(() => {
    setModule('Landing');
  }, [setModule]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="l-container">
        <section className="l-section">
          <Story />
        </section>
        <FeaturedDish />
      </div>
      <CraftSection />
      <Contact />
    </div>
  );
};

export default LandingPage;
