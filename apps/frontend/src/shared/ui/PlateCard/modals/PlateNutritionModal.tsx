/**
 * @file PlateNutritionModal.tsx
 * @module Landing
 * @description Archivo PlateNutritionModal alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: framer-motion, react, Portal, PlateDataIcons, landingPlateNutrition
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
import { useState } from 'react';
import { PlateDataIcon, PlateDifficultyIcon, StarRatingDisplay } from '@/shared/ui/PlateDataIcons';
import {
  formatLandingEnum,
  formatLandingMetric,
  formatLandingPrice,
  getPlateIngredientAnalysis,
  selectFeaturedMetrics,
  type LandingPlate,
} from '@/shared/utils/plateNutrition';
import Portal from '@/shared/ui/Portal';
import {
  featuredChipStyles,
  insightToneStyles,
  plateCardStyles,
  plateModalMediaStyles,
  plateModalPanelStyles,
} from '@/styles/modules/plateCard';
import { cn } from '@/styles/utils/cn';

interface PlateNutritionModalProps {
  plate: LandingPlate;
  onClose: () => void;
}

const renderEnumChips = (items: string[]) =>
  items.map((item) => (
    <span key={item} className={featuredChipStyles()}>
      {formatLandingEnum(item)}
    </span>
  ));

const PlateNutritionModal = ({ plate, onClose }: PlateNutritionModalProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const analysis = getPlateIngredientAnalysis(plate);
  const hasMediaImage = Boolean(plate.imageUrl && !imageFailed);
  const heroMetrics = selectFeaturedMetrics(analysis.totalMetrics, 4);
  const leadCopy =
    analysis.marketingSummary || 'Lectura nutricional completa de la porcion final servida.';

  return (
    <Portal>
      <motion.div
        className={plateCardStyles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={plateModalPanelStyles({ kind: 'nutrition' })}
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={plateCardStyles.modalHeader}>
            <div className={plateCardStyles.modalIdentity}>
              <p className={plateCardStyles.modalKicker}>Ficha nutricional</p>
              <h3 className={plateCardStyles.modalTitle}>{plate.name}</h3>
              <p className={plateCardStyles.modalDescription}>{leadCopy}</p>

              <div className={plateCardStyles.modalMeta}>
                <span className={featuredChipStyles({ tone: 'accent' })}>
                  {formatLandingPrice(plate.menuPrice)}
                </span>
                <span className={featuredChipStyles()}>
                  {formatLandingMetric(plate.servedWeightGrams, 'g', 0)}
                </span>
                <span className={featuredChipStyles()}>
                  {analysis.servings === 1 ? '1 porcion servida' : `${analysis.servings} porciones`}
                </span>
              </div>
            </div>

            <button type="button" className={plateCardStyles.closeButton} onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className={plateCardStyles.modalScroll}>
            <section className={plateCardStyles.modalSection}>
              <div className={plateCardStyles.modalHero}>
                <div className={plateModalMediaStyles({ withImage: hasMediaImage })}>
                  {hasMediaImage ? (
                    <img
                      src={plate.imageUrl!}
                      alt={plate.name}
                      className={plateCardStyles.modalMediaImage}
                      loading="lazy"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <div className={plateCardStyles.modalMediaFallback}>
                      <PlateDataIcon
                        icon="recipe"
                        className={plateCardStyles.modalMediaFallbackIcon}
                      />
                      <span>Vista del plato</span>
                    </div>
                  )}
                </div>

                <div className={plateCardStyles.modalHeroPanel}>
                  <div className={plateCardStyles.sectionHeading}>
                    <div className={plateCardStyles.sectionHeadingBody}>
                      <p className={plateCardStyles.modalKicker}>Lectura general</p>
                      <h4 className={plateCardStyles.sectionHeadingTitle}>
                        {analysis.marketingHeadline}
                      </h4>
                    </div>
                  </div>

                  <div className={plateCardStyles.modalHeroMeta}>
                    <div className={plateCardStyles.metricCard}>
                      <span className={plateCardStyles.metricLabel}>Tipo</span>
                      <strong className={plateCardStyles.metricValue}>
                        {formatLandingEnum(plate.recipe.type)}
                      </strong>
                    </div>
                    <div className={plateCardStyles.metricCard}>
                      <span className={plateCardStyles.metricLabel}>Tamano</span>
                      <strong className={plateCardStyles.metricValue}>
                        {formatLandingEnum(plate.size)}
                      </strong>
                    </div>
                    <div className={plateCardStyles.metricCard}>
                      <span className={plateCardStyles.metricLabel}>Dificultad</span>
                      <strong
                        className={cn(plateCardStyles.metricValue, plateCardStyles.metricValueIcon)}
                      >
                        <PlateDifficultyIcon
                          difficulty={plate.recipe.difficulty}
                          className={plateCardStyles.modalDifficulty}
                        />
                      </strong>
                    </div>
                    <div className={plateCardStyles.metricCard}>
                      <span className={plateCardStyles.metricLabel}>Valoracion</span>
                      <strong
                        className={cn(
                          plateCardStyles.metricValue,
                          plateCardStyles.metricValueStack,
                        )}
                      >
                        <StarRatingDisplay value={plate.avgRating} size={16} />
                      </strong>
                    </div>
                  </div>

                  <div className={plateCardStyles.stack}>
                    <p className={plateCardStyles.note}>
                      Los valores se calculan sobre la porcion final servida y se comparan contra
                      referencias diarias para que la lectura sea clara.
                    </p>
                    <p className={plateCardStyles.note}>
                      Si queres ver ingredientes, gramos reales y paso a paso, abrí la vista
                      &quot;Receta&quot; desde la card.
                    </p>

                    <div className={plateCardStyles.chipRow}>
                      {renderEnumChips(plate.dietaryTags)}
                      {renderEnumChips(plate.nutritionTags)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {heroMetrics.length > 0 && (
              <section className={plateCardStyles.modalSection}>
                <div className={plateCardStyles.sectionHeading}>
                  <div className={plateCardStyles.sectionHeadingBody}>
                    <p className={plateCardStyles.modalKicker}>Señales grandes</p>
                    <h4 className={plateCardStyles.sectionHeadingTitle}>
                      Lo mas importante del plato sin perder de vista el antojo
                    </h4>
                  </div>
                  <strong className={plateCardStyles.sectionHeadingMeta}>Lectura resumida</strong>
                </div>

                <div className={plateCardStyles.nutritionHeroGrid}>
                  {heroMetrics.map((metric) => (
                    <article
                      key={metric.key}
                      className={cn(
                        plateCardStyles.nutritionHeroCard,
                        insightToneStyles[metric.tone],
                      )}
                    >
                      <div className={plateCardStyles.nutritionHeroHead}>
                        <span className={plateCardStyles.nutritionIconBox}>
                          <PlateDataIcon
                            icon={metric.icon}
                            className={plateCardStyles.nutritionHeroIcon}
                          />
                        </span>
                        <span className={plateCardStyles.nutritionTone}>{metric.label}</span>
                      </div>

                      <div className={plateCardStyles.nutritionHeroCopy}>
                        <strong>{metric.totalValue}</strong>
                        <span>Total del plato</span>
                      </div>

                      <div
                        className={cn(
                          plateCardStyles.nutritionHeroCopy,
                          plateCardStyles.nutritionHeroCopySecondary,
                        )}
                      >
                        <strong>{metric.perPortionValue}</strong>
                        <span>Por porcion servida</span>
                      </div>

                      <p className={plateCardStyles.note}>{metric.note}</p>
                      <p className={plateCardStyles.note}>{metric.dailyValueLabel}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className={plateCardStyles.modalSection}>
              <div className={plateCardStyles.sectionHeading}>
                <div className={plateCardStyles.sectionHeadingBody}>
                  <p className={plateCardStyles.modalKicker}>Ficha completa</p>
                  <h4 className={plateCardStyles.sectionHeadingTitle}>
                    Todos los totales nutricionales visibles para esta porcion
                  </h4>
                </div>
                <strong className={plateCardStyles.sectionHeadingMeta}>
                  {analysis.totalMetrics.length} metricas
                </strong>
              </div>

              <div className={plateCardStyles.totalGrid}>
                {analysis.totalMetrics.map((metric) => (
                  <article
                    key={metric.key}
                    className={cn(plateCardStyles.totalCard, insightToneStyles[metric.tone])}
                  >
                    <div className={plateCardStyles.totalCardHead}>
                      <PlateDataIcon icon={metric.icon} className={plateCardStyles.totalCardIcon} />
                      <span>{metric.label}</span>
                    </div>
                    <strong>{metric.totalValue}</strong>
                    <small>{metric.perPortionValue} por porcion</small>
                    <p className={plateCardStyles.note}>{metric.note}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={plateCardStyles.modalSection}>
              <div className={plateCardStyles.sectionHeading}>
                <div className={plateCardStyles.sectionHeadingBody}>
                  <p className={plateCardStyles.modalKicker}>Tabla base</p>
                  <h4 className={plateCardStyles.sectionHeadingTitle}>
                    Valores de referencia usados para leer lo que si tiene objetivo diario claro
                  </h4>
                </div>
                <strong className={plateCardStyles.sectionHeadingMeta}>Base de referencia</strong>
              </div>

              <div className={plateCardStyles.referenceTableShell}>
                <table className={plateCardStyles.referenceTable}>
                  <thead>
                    <tr>
                      <th>Metrica</th>
                      <th>Diario</th>
                      <th>Semanal</th>
                      <th>Mensual</th>
                      <th>Anual</th>
                      <th>Base</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.referenceRows.map((row) => (
                      <tr key={row.key} className={insightToneStyles[row.tone]}>
                        <td>
                          <div className={plateCardStyles.referenceMetric}>
                            <PlateDataIcon
                              icon={row.icon}
                              className={plateCardStyles.referenceIcon}
                            />
                            <div>
                              <strong>{row.label}</strong>
                              <small>{row.toneLabel}</small>
                            </div>
                          </div>
                        </td>
                        <td>{row.daily}</td>
                        <td>{row.weekly}</td>
                        <td>{row.monthly}</td>
                        <td>{row.yearly}</td>
                        <td>
                          <span className={plateCardStyles.referenceSource}>{row.sourceLabel}</span>
                          <p className={plateCardStyles.note}>{row.note}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={plateCardStyles.referenceNotes}>
                {analysis.qualitativeReferenceNotes.map((note) => (
                  <p key={note} className={plateCardStyles.note}>
                    {note}
                  </p>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default PlateNutritionModal;
