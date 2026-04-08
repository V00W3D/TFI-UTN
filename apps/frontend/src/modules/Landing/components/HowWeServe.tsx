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
import { Link } from 'react-router-dom';

/**
 * @file HowWeServe.tsx
 * @description EN TU CASA (delivery) y EN EL LOCAL (salón + retiro / para llevar).
 * Tokens de public/themes: superficies, inversión, bordes.
 */
const HowWeServe = () => {
  return (
    <section
      id="locales"
      className="py-16 md:py-24 bg-qart-bg relative overflow-hidden border-b-4 border-qart-border"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <p className="text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-qart-accent mb-3">
          Pedí como quieras
        </p>
        <h2 className="text-center font-display text-qart-primary text-2xl md:text-3xl font-black uppercase tracking-tight mb-10 md:mb-14 max-w-3xl mx-auto leading-tight">
          Entrá directo al menú o elegí si preferís delivery o pasar por el local
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          {/* EN TU CASA — delivery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col bg-qart-surface border-4 border-qart-border p-6 md:p-10 shadow-[var(--qart-shadow-sharp)]"
          >
            <h3 className="font-display text-3xl sm:text-4xl md:text-[2.85rem] lg:text-[3.25rem] text-qart-primary uppercase font-black tracking-tighter mb-2 leading-[0.95]">
              EN TU CASA
            </h3>
            <p className="text-sm md:text-base font-bold uppercase tracking-wide text-qart-accent mb-6">
              Delivery
            </p>
            <p className="text-[0.95rem] text-qart-text-muted mb-6 font-bold uppercase tracking-tight leading-snug">
              Recibí QART en la puerta: mismo menú, tiempos claros y encargo simple desde el
              celular.
            </p>
            <div className="space-y-3 flex-1">
              {[
                'Envío a domicilio',
                'Seguimiento del pedido',
                'Pagá como prefieras al recibir',
              ].map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-3 border-2 border-qart-border px-3.5 py-2 bg-qart-bg-warm/30"
                >
                  <div className="w-2.5 h-2.5 bg-qart-accent shrink-0" />
                  <span className="text-[0.82rem] font-black text-qart-primary uppercase tracking-widest">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/search"
              className="mt-8 btn-primary w-full text-center text-[0.9rem] uppercase tracking-widest py-3.5 justify-center"
            >
              Pedir con delivery
            </Link>
          </motion.div>

          {/* EN EL LOCAL — salón + para llevar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col border-4 border-qart-border p-6 md:p-10"
            style={{
              background: 'var(--qart-surface-inverse)',
              boxShadow: 'var(--qart-shadow-sharp)',
            }}
          >
            <h3
              className="font-display text-3xl sm:text-4xl md:text-[2.85rem] lg:text-[3.25rem] uppercase font-black tracking-tighter mb-2 leading-[0.95]"
              style={{ color: 'var(--qart-text-on-inverse)' }}
            >
              EN EL LOCAL
            </h3>
            <p
              className="text-sm md:text-base font-bold uppercase tracking-wide mb-8"
              style={{ color: 'var(--qart-accent-warm)' }}
            >
              Salón · Para llevar
            </p>

            <div className="space-y-8 flex-1">
              <div>
                <h4
                  className="text-xs font-black uppercase tracking-[0.2em] mb-3"
                  style={{ color: 'var(--qart-text-on-inverse)' }}
                >
                  Comer en QART
                </h4>
                <p
                  className="text-[0.92rem] font-bold uppercase tracking-tight leading-snug mb-4"
                  style={{ color: 'var(--qart-text-on-inverse-dim)' }}
                >
                  Mesas en el salón, mismo menú en pantalla y atención en el barrio.
                </p>
                <ul className="space-y-2">
                  {['Sin reserva', 'De 12 a cierre', 'Ideal para compartir'].map((t) => (
                    <li
                      key={t}
                      className="text-[0.78rem] font-black uppercase tracking-widest border-l-4 border-qart-accent pl-3"
                      style={{ color: 'var(--qart-text-on-inverse)' }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="pt-6 border-t-2"
                style={{ borderColor: 'var(--qart-border-on-inverse)' }}
              >
                <h4
                  className="text-xs font-black uppercase tracking-[0.2em] mb-3"
                  style={{ color: 'var(--qart-text-on-inverse)' }}
                >
                  Para llevar / retiro
                </h4>
                <p
                  className="text-[0.92rem] font-bold uppercase tracking-tight leading-snug"
                  style={{ color: 'var(--qart-text-on-inverse-dim)' }}
                >
                  Pedí online, pasá a retirar cuando avisemos y llevate todo listo. Perfecto si
                  vivís cerca o salís de la facu.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/search"
                className="btn-primary flex-1 text-center text-[0.85rem] uppercase tracking-widest py-3 justify-center"
              >
                Pedir para retiro
              </Link>
              <a
                href="#contact"
                className="btn-outline flex-1 text-center text-[0.85rem] uppercase tracking-widest py-3 justify-center border-2 bg-qart-bg text-qart-text border-qart-border"
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
