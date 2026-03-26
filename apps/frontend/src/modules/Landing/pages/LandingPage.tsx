import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../../appStore';
import Hero from '../components/Hero';
import Story from '../components/Story';
import FeaturedDish from '../components/FeaturedDish';
import CraftSection from '../components/CraftSection';
import Contact from '../components/Contact';
import '../LandingPages.css';

/**
 * @file LandingPage.tsx
 * @author Victor
 * @description Main entry point for the restaurant's public face.
 * Orchestrates premium sections with reveal animations and sets the application state.
 */
const LandingPage = () => {
  const { setModule } = useAppStore();

  useEffect(() => {
    setModule('LANDING');
  }, [setModule]);

  return (
    <main className="min-h-screen bg-bg overflow-x-hidden">
      <Hero />

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-24"
      >
        <Story />
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-surface-soft py-24"
      >
        <div className="container mx-auto px-6">
          <FeaturedDish />
        </div>
      </motion.section>

      <CraftSection />

      <Contact />
    </main>
  );
};

export default LandingPage;
