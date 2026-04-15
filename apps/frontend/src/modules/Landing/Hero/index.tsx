/**
 * @file Hero.tsx
 * @module Landing
 * @description Archivo Hero alineado a la arquitectura y trazabilidad QART.
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
 * @file Hero.tsx
 * @description Tono rápido y juvenil (cadena / burger energy), sin perder tokens QART.
 */
const Hero = () => {
  return (
    <section className={landingSectionStyles.heroSection}>
      <div className={landingSectionStyles.heroAccentRail} />

      <div className={landingSectionStyles.heroGrid}>
        <div className={landingSectionStyles.heroCopy}>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className={landingSectionStyles.heroBadge}
          >
            Rápido · Rico · Sin drama
          </motion.div>

          <motion.h1
            className={landingSectionStyles.heroTitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            Comé bien,
            <br />
            <span className={landingSectionStyles.heroTitleAccent}>sin complicarte.</span>
          </motion.h1>

          <motion.p
            className={landingSectionStyles.heroLead}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Pedidos claros, precios al frente y el mismo espíritu de barrio. Si te copa el detalle
            de armado, el crafteo está — suave, nada forzado.
          </motion.p>

          <motion.div
            className={landingSectionStyles.heroActions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
          >
            <Link
              to="/search"
              className={cn(buttonStyles({ variant: 'primary' }), landingSectionStyles.heroPrimaryCta)}
            >
              Pedir ahora
            </Link>
            <button
              type="button"
              className={cn(
                buttonStyles({ variant: 'secondary' }),
                landingSectionStyles.heroSecondaryCta,
              )}
              onClick={() =>
                document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Favoritos
            </button>
            <button
              type="button"
              className={cn(
                buttonStyles({ variant: 'secondary' }),
                landingSectionStyles.heroSecondaryCta,
              )}
              onClick={() =>
                document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Cómo funciona
            </button>
          </motion.div>
        </div>

        <motion.div
          className={landingSectionStyles.heroMedia}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <div className={landingSectionStyles.heroFrame}>
            <img
              src="/hero.png"
              alt="Plato del menú"
              className={landingSectionStyles.heroImage}
            />
            <div className={landingSectionStyles.heroBlock} />
          </div>
        </motion.div>
      </div>

      <div className={landingSectionStyles.heroFooter} />
    </section>
  );
};

export default Hero;
