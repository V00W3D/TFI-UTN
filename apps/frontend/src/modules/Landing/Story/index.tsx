/**
 * @file Story.tsx
 * @module Landing
 * @description Archivo Story alineado a la arquitectura y trazabilidad QART.
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
 * @file Story.tsx (Repurposed as "How it Works")
 * @description Engaging, interactive 3-step flow showing the user how easy it is to build a burger.
 */
const Story = () => {
  const steps = [
    {
      title: 'Elegí tu base',
      desc: 'Milanesa, burger o alternativa veggie. Elegís la base y arrancás el pedido desde ahí.',
      icon: (
        <svg
          width="48"
          height="48"
          fill="none"
          viewBox="0 0 24 24"
          stroke="var(--qart-accent)"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
        </svg>
      ),
      color: 'bg-qart-accent/10',
    },
    {
      title: 'Sumá lo que quieras',
      desc: 'Agregá ingredientes, salsas y extras según tu gusto, con una vista clara de cada opción.',
      icon: (
        <svg
          width="48"
          height="48"
          fill="none"
          viewBox="0 0 24 24"
          stroke="var(--qart-accent-2)"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      color: 'bg-qart-accent-2/10',
    },
    {
      title: 'Recibilo o vení al local',
      desc: 'Elegí envío o retiro y seguí todo en pocos pasos, sin perder tiempo entre pantallas.',
      icon: (
        <svg
          width="48"
          height="48"
          fill="none"
          viewBox="0 0 24 24"
          stroke="var(--qart-primary)"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      color: 'bg-qart-primary/10',
    },
  ];

  return (
    <section id="como-funciona" className={landingSectionStyles.storySection}>
      <div className={landingSectionStyles.storyDividerWrap}>
        <svg
          className={landingSectionStyles.storyDividerSvg}
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="var(--qart-bg)"
            opacity="0.6"
          ></path>
        </svg>
      </div>
      <div className={landingSectionStyles.storyTopLine} />
      <div className={landingSectionStyles.storyInner}>
        <div className={landingSectionStyles.storyHeader}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={landingSectionStyles.storyEyebrow}
          >
            Claro desde el inicio
          </motion.span>
          <h2 className={landingSectionStyles.storyTitle}>
            Armá tu pedido <br />{' '}
            <span className={landingSectionStyles.storyTitleAccent}>en tres pasos</span>
          </h2>
        </div>

        <div className={landingSectionStyles.storyGrid}>
          <div className={landingSectionStyles.storyConnector} />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className={landingSectionStyles.storyCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
            >
              <div className={landingSectionStyles.storyIconWrap}>
                {step.icon}
                <div className={landingSectionStyles.storyStepBadge}>{idx + 1}</div>
              </div>

              <h3 className={landingSectionStyles.storyCardTitle}>
                {step.title}
              </h3>
              <p className={landingSectionStyles.storyCardCopy}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Story;
