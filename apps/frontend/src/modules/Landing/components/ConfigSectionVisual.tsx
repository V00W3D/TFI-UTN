/**
 * @file ConfigSectionVisual.tsx
 * @module Landing
 * @description Archivo ConfigSectionVisual alineado a la arquitectura y trazabilidad QART.
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
import { useAppStore } from '../../../appStore';
import { SectionFactory } from '../../../components/shared/SectionFactory';

export const ConfigSectionVisual = () => {
  const { simpleMode, setSimpleMode } = useAppStore();

  const toggles = [
    {
      key: 'simple-mode',
      title: 'Activar modo simple',
      description:
        'Oculta métricas avanzadas y simplifica la vista de platos para enfocarse en lo esencial.',
      recommendation: 'Recomendado para entornos de alta velocidad.',
      checked: simpleMode,
      onToggle: () => setSimpleMode(!simpleMode),
    },
  ];

  return (
    <SectionFactory
      className="space-y-10"
      sections={[
        {
          key: 'visual',
          content: (
            <div className="space-y-10">
              <header>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-1.5 h-8 bg-qart-accent" />
                  <h2 className="text-2xl font-black uppercase tracking-tight text-qart-primary">
                    Preferencias de interfaz
                  </h2>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-qart-text-muted max-w-xl">
                  La vista visual también quedó preparada para crecer desde arrays de opciones.
                </p>
              </header>

              <div className="space-y-6">
                {toggles.map((toggle) => (
                  <article
                    key={toggle.key}
                    className="p-8 md:p-10 border-[3px] border-qart-border bg-qart-surface-sunken flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-sharp"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-qart-primary mb-3">
                        {toggle.title}
                      </h3>
                      <p className="text-qart-text-muted font-bold text-sm leading-relaxed max-w-sm">
                        {toggle.description}
                        <span className="block mt-2 text-qart-accent text-xs font-black uppercase italic">
                          {toggle.recommendation}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={toggle.onToggle}
                        className={`w-24 h-11 border-[3px] border-qart-primary relative flex items-center transition-all cursor-pointer shadow-sharp active:translate-x-1 active:translate-y-1 active:shadow-none ${
                          toggle.checked ? 'bg-qart-success' : 'bg-qart-surface'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 border-[3px] border-qart-primary bg-white absolute transition-all flex items-center justify-center ${
                            toggle.checked
                              ? 'translate-x-14 shadow-[-4px_0px_0px_var(--qart-primary)]'
                              : 'translate-x-1 shadow-[4px_0px_0px_var(--qart-primary)]'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              toggle.checked ? 'bg-qart-success' : 'bg-qart-border'
                            }`}
                          />
                        </div>
                      </button>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-qart-text-muted">
                        {toggle.checked ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="bg-qart-bg-warm p-8 border-2 border-qart-border-subtle flex items-start gap-4">
                <div className="text-qart-accent">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <p className="text-[11px] font-bold text-qart-text-muted leading-relaxed uppercase tracking-wide">
                  Nota: si más adelante agregamos densidad, animaciones o idioma visual, esta
                  sección ya está lista para crecer sin reescribir la estructura.
                </p>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};
