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
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: appStore, SectionFactory
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
import { useAppStore } from '@/shared/store/appStore';
import { SectionFactory } from '@/shared/ui/SectionFactory';
import {
  settingsStyles,
  settingsToggleDotStyles,
  settingsToggleThumbStyles,
  settingsToggleTrackStyles,
} from '@/styles/modules/settings';

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
      className={settingsStyles.visualStack}
      sections={[
        {
          key: 'visual',
          content: (
            <div className={settingsStyles.visualStack}>
              <header>
                <div className={settingsStyles.visualHeader}>
                  <div className={settingsStyles.visualAccent} />
                  <h2 className={settingsStyles.visualTitle}>
                    Preferencias de interfaz
                  </h2>
                </div>
                <p className={settingsStyles.visualLead}>
                  La vista visual también quedó preparada para crecer desde arrays de opciones.
                </p>
              </header>

              <div className={settingsStyles.visualList}>
                {toggles.map((toggle) => (
                  <article
                    key={toggle.key}
                    className={settingsStyles.visualCard}
                  >
                    <div className={settingsStyles.visualCopy}>
                      <h3 className={settingsStyles.visualCardTitle}>
                        {toggle.title}
                      </h3>
                      <p className={settingsStyles.visualCardText}>
                        {toggle.description}
                        <span className={settingsStyles.visualRecommendation}>
                          {toggle.recommendation}
                        </span>
                      </p>
                    </div>

                    <div className={settingsStyles.visualToggleGroup}>
                      <button
                        type="button"
                        onClick={toggle.onToggle}
                        className={settingsToggleTrackStyles({ checked: toggle.checked })}
                      >
                        <div
                          className={settingsToggleThumbStyles({ checked: toggle.checked })}
                        >
                          <div className={settingsToggleDotStyles({ checked: toggle.checked })} />
                        </div>
                      </button>
                      <span className={settingsStyles.visualToggleState}>
                        {toggle.checked ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className={settingsStyles.visualInfo}>
                <div className={settingsStyles.visualInfoIcon}>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <p className={settingsStyles.visualInfoText}>
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
