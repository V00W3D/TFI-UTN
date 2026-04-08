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
 * @file CraftSection.tsx
 * @description CTA block con fondo invertido. Usa --qart-surface-inverse
 * que es SIEMPRE oscuro en ambos modos — nunca depende de --qart-primary.
 */
const CraftSection = () => {
  return (
    <section
      id="craft"
      className="py-20 overflow-hidden relative border-y-4 border-qart-border"
      style={{ background: 'var(--qart-surface-inverse)' }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-display mb-6 leading-none uppercase font-black landing-welcome-craft-title"
          style={{ color: 'var(--qart-text-on-inverse)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Crafteo <br />
          <span className="text-qart-accent">sin apuro.</span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg font-bold uppercase tracking-tighter mb-9 max-w-2xl mx-auto leading-tight"
          style={{ color: 'var(--qart-text-on-inverse-dim)' }}
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
            className="px-7 py-3.5 text-base font-black uppercase tracking-[0.16em] border-4 transition-all duration-200"
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
            onClick={() =>
              document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Ver favoritos
          </button>
        </motion.div>
      </div>

      {/* Decoración geométrica — accent con opacidad sobre fondo oscuro */}
      <div
        className="absolute top-0 right-0 w-1/4 h-full hidden lg:block border-l-2"
        style={{
          background: 'rgba(232, 98, 26, 0.06)',
          borderColor: 'var(--qart-border-on-inverse)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-1/4 h-full hidden lg:block border-r-2"
        style={{
          background: 'rgba(232, 98, 26, 0.03)',
          borderColor: 'var(--qart-border-on-inverse)',
        }}
      />
    </section>
  );
};

export default CraftSection;
