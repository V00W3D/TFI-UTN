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
import { motion } from 'framer-motion';

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
          className="w-12 h-12 text-qart-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
          className="w-12 h-12 text-qart-accent-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
          className="w-12 h-12 text-qart-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
    <section id="como-funciona" className="py-20 bg-qart-bg relative overflow-hidden">
      {/* SECTION DIVIDER - Transition to destacados */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-12"
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
      {/* TOP DIVIDER - Clean line to transition from bg-warm */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-qart-border to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-14 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-qart-bg-warm text-qart-primary text-[0.72rem] font-bold rounded-none uppercase tracking-widest mb-4 border border-qart-border"
          >
            Claro desde el inicio
          </motion.span>
          <h2 className="text-3xl md:text-4xl text-qart-primary mb-4">
            Armá tu pedido <br /> <span className="text-qart-accent">en tres pasos</span>
          </h2>
        </div>

        {/* 3 STEP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-12 left-[15%] w-[70%] h-0.5 border-t-2 border-dashed border-qart-border -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
            >
              <div className="relative shrink-0 w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] bg-qart-bg-warm rounded-4xl flex items-center justify-center p-4 mb-5 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
                {/* Number Badge */}
                <div className="step-badge transition-all duration-300">{idx + 1}</div>
              </div>

              <h3 className="text-lg font-display text-qart-primary mb-2.5 group-hover:text-qart-accent transition-colors">
                {step.title}
              </h3>
              <p className="text-qart-text-muted text-[0.9rem] leading-relaxed px-3 font-medium">
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
