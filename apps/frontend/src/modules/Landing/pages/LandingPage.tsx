/**
 * @file LandingPage.tsx
 * @module Landing
 * @description Archivo LandingPage alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
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
