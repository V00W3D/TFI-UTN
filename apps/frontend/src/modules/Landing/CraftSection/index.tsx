/**
 * @file CraftSection.tsx
 * @module Landing
 * @description Archivo CraftSection alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: framer-motion
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
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
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
import { motion } from 'framer-motion';
import { landingSectionStyles } from '@/styles/modules/landingSections';

/**
 * @file CraftSection.tsx
 * @description CTA block con fondo invertido. Usa --qart-surface-inverse
 * que es SIEMPRE oscuro en ambos modos — nunca depende de --qart-primary.
 */
const CraftSection = () => {
  return (
    <section id="craft" className={landingSectionStyles.craftSection}>
      <div className={landingSectionStyles.craftInner}>
        <motion.h2
          className={landingSectionStyles.craftTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Crafteo <br />
          <span className={landingSectionStyles.craftTitleAccent}>sin apuro.</span>
        </motion.h2>

        <motion.p
          className={landingSectionStyles.craftLead}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Si querés ver cómo se arma cada cosa, acercate al detalle: es una invitación liviana, no
          una obligación. El salón sigue siendo el centro; esto suma cuando tenés curiosidad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <button
            type="button"
            className={landingSectionStyles.craftButton}
            onClick={() =>
              document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Ver favoritos
          </button>
        </motion.div>
      </div>

      <div className={landingSectionStyles.craftAccentRight} />
      <div className={landingSectionStyles.craftAccentLeft} />
    </section>
  );
};

export default CraftSection;
