/**
 * @file CraftPage.tsx
 * @module Landing
 * @description Archivo CraftPage alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: framer-motion
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
import { motion } from 'framer-motion';
import { landingSectionStyles } from '@/styles/modules/landingSections';

const CraftPage = () => {
  return (
    <div className={landingSectionStyles.craftViewPage}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={landingSectionStyles.craftViewCard}
      >
        <div className={landingSectionStyles.craftViewHead}>
          <div className={landingSectionStyles.craftViewIconBox}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--qart-text-on-accent)"
              strokeWidth="2.5"
              strokeLinecap="square"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h1 className={landingSectionStyles.craftViewTitle}>
            Crafteo
          </h1>
        </div>

        <p className={landingSectionStyles.craftViewLead}>
          Esta zona estará dedicada a combinar items y customizar tu menú. Próximamente.
        </p>
      </motion.div>
    </div>
  );
};

export default CraftPage;
