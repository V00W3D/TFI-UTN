/**
 * @file HowWeServe.tsx
 * @module Landing
 * @description Archivo HowWeServe alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: framer-motion, react-router-dom
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
import { Link } from 'react-router-dom';
import { buttonStyles } from '@/styles/components/button';
import { landingSectionStyles } from '@/styles/modules/landingSections';
import { cn } from '@/styles/utils/cn';

/**
 * @file HowWeServe.tsx
 * @description EN TU CASA (delivery) y EN EL LOCAL (salón + retiro / para llevar).
 * Tokens de public/themes: superficies, inversión, bordes.
 */
const HowWeServe = () => {
  return (
    <section id="locales" className={landingSectionStyles.serveSection}>
      <div className={landingSectionStyles.serveInner}>
        <p className={landingSectionStyles.serveEyebrow}>
          Pedí como quieras
        </p>
        <h2 className={landingSectionStyles.serveTitle}>
          Entrá directo al menú o elegí si preferís delivery o pasar por el local
        </h2>

        <div className={landingSectionStyles.serveGrid}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              landingSectionStyles.serveCard,
              landingSectionStyles.serveCardDefault,
            )}
          >
            <h3 className={landingSectionStyles.serveCardTitle}>
              EN TU CASA
            </h3>
            <p className={landingSectionStyles.serveCardKicker}>
              Delivery
            </p>
            <p className={landingSectionStyles.serveCardLead}>
              Recibí QART en la puerta: mismo menú, tiempos claros y encargo simple desde el
              celular.
            </p>
            <div className={landingSectionStyles.serveList}>
              {[
                'Envío a domicilio',
                'Seguimiento del pedido',
                'Pagá como prefieras al recibir',
              ].map((feat) => (
                <div key={feat} className={landingSectionStyles.serveFeature}>
                  <div className={landingSectionStyles.serveFeatureDot} />
                  <span className={landingSectionStyles.serveFeatureText}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/search"
              className={cn(buttonStyles({ variant: 'primary' }), landingSectionStyles.servePrimaryButton)}
            >
              Pedir con delivery
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              landingSectionStyles.serveCard,
              landingSectionStyles.serveCardInverse,
            )}
          >
            <h3 className={landingSectionStyles.serveCardTitleInverse}>
              EN EL LOCAL
            </h3>
            <p className={landingSectionStyles.serveCardKickerInverse}>
              Salón · Para llevar
            </p>

            <div className={landingSectionStyles.serveInverseBody}>
              <div>
                <h4 className={landingSectionStyles.serveInverseGroupTitle}>
                  Comer en QART
                </h4>
                <p className={landingSectionStyles.serveInverseGroupCopy}>
                  Mesas en el salón, mismo menú en pantalla y atención en el barrio.
                </p>
                <ul className={landingSectionStyles.serveInverseList}>
                  {['Sin reserva', 'De 12 a cierre', 'Ideal para compartir'].map((t) => (
                    <li key={t} className={landingSectionStyles.serveInverseItem}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={landingSectionStyles.serveInverseDivider}>
                <h4 className={landingSectionStyles.serveInverseGroupTitle}>
                  Para llevar / retiro
                </h4>
                <p className={landingSectionStyles.serveInverseGroupCopy}>
                  Pedí online, pasá a retirar cuando avisemos y llevate todo listo. Perfecto si
                  vivís cerca o salís de la facu.
                </p>
              </div>
            </div>

            <div className={landingSectionStyles.serveActions}>
              <Link
                to="/search"
                className={cn(buttonStyles({ variant: 'primary' }), landingSectionStyles.servePrimaryButton)}
              >
                Pedir para retiro
              </Link>
              <a
                href="#contact"
                className={cn(buttonStyles({ variant: 'secondary' }), landingSectionStyles.serveOutlineButton)}
              >
                Cómo llegar
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowWeServe;
