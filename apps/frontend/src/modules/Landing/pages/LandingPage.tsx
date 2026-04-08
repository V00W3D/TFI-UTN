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
 * inputs: stores, hooks, params de ruta, modales y componentes del modulo
 * outputs: pantalla completa renderizada con sus flujos de interaccion
 * rules: coordinar estado de pagina sin duplicar logica de dominio
 *
 * @technical
 * dependencies: react, Navbar, Hero, Story, HowWeServe, FeaturedSpotlight, CraftSection, Contact, OrderPanel, appStore, LandingPages.css
 * flow: lee estado global y local de la pantalla; coordina formularios, fetches o modales; compone secciones reutilizables; renderiza la experiencia completa de la pagina.
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
 * decisions: la pagina orquesta estado y delega presentacion fina a componentes especializados
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
