import { motion } from 'framer-motion';

/**
 * @file HowWeServe.tsx
 * @description Cards Delivery y Dine-in. La card "En el local" usa
 * --qart-surface-inverse (siempre oscuro) en lugar de --qart-primary
 * que en dark mode es blanco y causaba texto invisible.
 */
const HowWeServe = () => {
  return (
    <section
      id="locales"
      className="py-20 bg-qart-bg relative overflow-hidden border-b-4 border-qart-border"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* ── DELIVERY — fondo surface normal ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-qart-surface p-7 md:p-8 border-4 border-qart-border flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div
                className="w-14 h-14 flex items-center justify-center mb-6 border-4 border-qart-border"
                style={{
                  background: 'var(--qart-accent)',
                  color: 'var(--qart-text-on-accent)',
                  boxShadow: 'var(--qart-shadow-accent)',
                }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl text-qart-primary mb-4 uppercase tracking-tighter font-black">
                A domicilio
              </h3>
              <p className="text-[0.95rem] text-qart-text-muted mb-6 font-bold uppercase tracking-tight leading-tight">
                Te llevamos el pedido a donde estés, con tiempos claros y seguimiento simple.
              </p>
              <div className="space-y-3">
                {['Seguimiento del pedido', 'Entrega prioritaria', 'Cobertura amplia'].map(
                  (feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-3 border-2 border-qart-border px-3.5 py-2"
                    >
                      <div className="w-2.5 h-2.5 bg-qart-accent shrink-0" />
                      <span className="text-[0.82rem] font-black text-qart-primary uppercase tracking-widest">
                        {feat}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <button className="mt-7 btn-primary w-full text-[0.9rem] uppercase tracking-widest">
              Pedir online
            </button>
          </motion.div>

          {/* ── DINE-IN — fondo invertido (siempre oscuro) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative p-7 md:p-8 border-4 border-qart-border flex flex-col justify-between"
            style={{ background: 'var(--qart-surface-inverse)' }}
          >
            <div className="relative z-10">
              <div
                className="w-14 h-14 flex items-center justify-center mb-6 border-4 border-qart-border"
                style={{
                  background: 'var(--qart-accent)',
                  color: 'var(--qart-text-on-accent)',
                  boxShadow: 'var(--qart-shadow-accent)',
                }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3
                className="text-3xl mb-4 uppercase tracking-tighter font-black"
                style={{ color: 'var(--qart-text-on-inverse)' }}
              >
                En el local
              </h3>
              <p
                className="text-[0.95rem] mb-6 font-bold uppercase tracking-tight leading-tight"
                style={{ color: 'var(--qart-text-on-inverse-dim)' }}
              >
                Un espacio cómodo, atención cercana y un guiño a Tucumán para vivir la marca en el
                local.
              </p>
              <div className="space-y-3">
                {['Abierto de 12 a 23 hs', 'Sin reserva previa', 'Mesas para grupos'].map(
                  (feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-3 px-3.5 py-2 border-2"
                      style={{ borderColor: 'var(--qart-border-on-inverse)' }}
                    >
                      <div className="w-2.5 h-2.5 bg-qart-accent shrink-0" />
                      <span
                        className="text-[0.82rem] font-black uppercase tracking-widest"
                        style={{ color: 'var(--qart-text-on-inverse)' }}
                      >
                        {feat}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <button
              className="mt-7 w-full text-[0.9rem] uppercase tracking-widest font-black border-4 py-2.5 px-5 transition-all duration-200"
              style={{
                background: 'var(--qart-bg)',
                color: 'var(--qart-text)',
                borderColor: 'var(--qart-border)',
                boxShadow: 'var(--qart-shadow-sharp)',
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = 'translate(-2px,-2px)';
                b.style.boxShadow = 'var(--qart-shadow-hover)';
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = '';
                b.style.boxShadow = 'var(--qart-shadow-sharp)';
              }}
            >
              Ver dirección
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowWeServe;
