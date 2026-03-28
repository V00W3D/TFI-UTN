import { motion } from 'framer-motion';

/**
 * @file HowWeServe.tsx
 * @description Sharp architectural cards for Delivery and Dine-in.
 */
const HowWeServe = () => {
  return (
    <section id="locales" className="py-32 bg-qart-bg relative overflow-hidden border-b-4 border-qart-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* DELIVERY CARD (OUTLINE STYLE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-qart-surface p-12 border-4 border-qart-border flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="w-20 h-20 bg-qart-accent flex items-center justify-center mb-10 border-4 border-qart-border shadow-hover" style={{ color: 'var(--qart-text-on-accent)' }}>
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-5xl text-qart-primary mb-6 uppercase tracking-tighter font-black">
                A domicilio
              </h3>
              <p className="text-lg text-qart-text-muted mb-10 font-bold uppercase tracking-tight leading-tight">
                Llevamos el sabor del barrio directamente a tu mesa. Envases sustentables y entrega veloz.
              </p>

              <div className="space-y-4">
                {['Rastreo en vivo', 'Envío prioritario', 'Zona Amplia'].map((feat) => (
                  <div key={feat} className="flex items-center gap-4 border-2 border-qart-border px-5 py-3">
                    <div className="w-3 h-3 bg-qart-accent" />
                    <span className="text-sm font-black text-qart-primary uppercase tracking-widest">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-12 btn-primary w-full text-xl uppercase tracking-widest">
              Pedir Ahora
            </button>
          </motion.div>

          {/* DINE-IN CARD (INVERSE SOLID STYLE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-qart-primary p-12 border-4 border-qart-border flex flex-col justify-between"
          >
            <div className="relative z-10 text-qart-text-inv">
              <div className="w-20 h-20 bg-qart-accent flex items-center justify-center mb-10 border-4 border-qart-border shadow-hover" style={{ color: 'var(--qart-text-on-accent)' }}>
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-5xl mb-6 uppercase tracking-tighter font-black">
                En el local
              </h3>
              <p className="text-lg opacity-80 mb-10 font-bold uppercase tracking-tight leading-tight">
                Ambiente relajado, buena música y la mejor atención. El spot ideal del barrio.
              </p>

              <div className="space-y-4">
               {['Puertas abiertas 12-23hs', 'Sin reserva previa', 'Música en vivo'].map((feat) => (
                  <div key={feat} className="flex items-center gap-4 border-2 border-current px-5 py-3 opacity-90">
                    <div className="w-3 h-3 bg-qart-accent" />
                    <span className="text-sm font-black uppercase tracking-widest">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-12 btn-outline w-full text-xl uppercase tracking-widest !bg-qart-bg !text-qart-primary !border-qart-border shadow-hover">
              Ver Ubicación
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowWeServe;
