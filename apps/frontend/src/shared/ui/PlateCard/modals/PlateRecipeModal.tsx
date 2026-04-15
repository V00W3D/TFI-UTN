/**
 * @file PlateRecipeModal.tsx
 * @module Landing
 * @description Archivo PlateRecipeModal alineado a la arquitectura y trazabilidad QART.
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
  getPlateRecipeGuide,
  type LandingPlate,
} from '@/shared/utils/plateNutrition';
import Portal from '@/shared/ui/Portal';
import {
  featuredChipStyles,
  plateCardStyles,
  plateModalMediaStyles,
  plateModalPanelStyles,
} from '@/styles/modules/plateCard';
import { cn } from '@/styles/utils/cn';

interface PlateRecipeModalProps {
  plate: LandingPlate;
  onClose: () => void;
}

const PlateRecipeModal = ({ plate, onClose }: PlateRecipeModalProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const guide = getPlateRecipeGuide(plate);
  const hasMediaImage = Boolean(plate.imageUrl && !imageFailed);

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
          className={plateModalPanelStyles({ kind: 'recipe' })}
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={plateCardStyles.modalHeader}>
            <div className={plateCardStyles.modalIdentity}>
              <p className={plateCardStyles.modalKicker}>Receta abierta</p>
              <h3 className={plateCardStyles.modalTitle}>{plate.name}</h3>
              <p className={plateCardStyles.modalDescription}>{guide.summary}</p>

              <div className={plateCardStyles.modalMeta}>
                <span className={featuredChipStyles({ tone: 'accent' })}>
                  {formatLandingPrice(plate.menuPrice)}
                </span>
                <span className={featuredChipStyles()}>
                  {guide.servings === 1 ? '1 porcion' : `${guide.servings} porciones`}
                </span>
                {guide.prepTimeMinutes != null && (
                  <span className={featuredChipStyles()}>
                    {formatLandingMetric(guide.prepTimeMinutes, 'min', 0)} de prep
                  </span>
                )}
                {guide.cookTimeMinutes != null && (
                  <span className={featuredChipStyles()}>
                    {formatLandingMetric(guide.cookTimeMinutes, 'min', 0)} de coccion
                  </span>
                )}
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
                      <p className={plateCardStyles.modalKicker}>Lectura de cocina</p>
                      <h4 className={plateCardStyles.sectionHeadingTitle}>
                        Como prepara QART este plato para que salga igual de tentador
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
                    {plate.recipe.assemblyNotes ? (
                      <p className={plateCardStyles.note}>{plate.recipe.assemblyNotes}</p>
                    ) : null}
                    <p className={plateCardStyles.note}>
                      Ingredientes finales con gramos reales y una secuencia simple para replicarlo
                      en casa.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className={plateCardStyles.modalSection}>
              <div className={plateCardStyles.sectionHeading}>
                <div className={plateCardStyles.sectionHeadingBody}>
                  <p className={plateCardStyles.modalKicker}>Ingredientes</p>
                  <h4 className={plateCardStyles.sectionHeadingTitle}>
                    Lo que necesita esta version del plato
                  </h4>
                </div>
                <strong className={plateCardStyles.sectionHeadingMeta}>
                  {guide.ingredients.length} ingredientes finales
                </strong>
              </div>

              <div className={plateCardStyles.recipeIngredientGrid}>
                {guide.ingredients.map((ingredient) => (
                  <article key={ingredient.id} className={plateCardStyles.recipeCard}>
                    <div className={plateCardStyles.recipeCardHead}>
                      <span className={plateCardStyles.recipeIconBox}>
                        <PlateDataIcon
                          icon={ingredient.icon}
                          className={plateCardStyles.recipeIcon}
                        />
                      </span>
                      <div>
                        <p className={plateCardStyles.subcardEyebrow}>{ingredient.categoryLabel}</p>
                        <h5 className={plateCardStyles.sectionHeadingTitle}>{ingredient.name}</h5>
                      </div>
                    </div>

                    <div className={plateCardStyles.recipeIngredientMeta}>
                      <div className={plateCardStyles.recipePill}>
                        <span>Gramos reales</span>
                        <strong>{formatLandingMetric(ingredient.quantityGrams, 'g', 0)}</strong>
                      </div>
                      <div className={plateCardStyles.recipePill}>
                        <span>Rol</span>
                        <strong>{ingredient.isMainComponent ? 'Principal' : 'Armado'}</strong>
                      </div>
                    </div>

                    <div className={plateCardStyles.chipRow}>
                      {ingredient.variants.map((variant) => (
                        <span key={variant} className={featuredChipStyles({ tone: 'accent' })}>
                          {variant}
                        </span>
                      ))}
                      {ingredient.preparations.map((preparation) => (
                        <span key={preparation} className={featuredChipStyles()}>
                          {preparation}
                        </span>
                      ))}
                    </div>

                    {ingredient.note ? (
                      <p className={plateCardStyles.note}>{ingredient.note}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className={plateCardStyles.modalSection}>
              <div className={plateCardStyles.sectionHeading}>
                <div className={plateCardStyles.sectionHeadingBody}>
                  <p className={plateCardStyles.modalKicker}>Paso a paso</p>
                  <h4 className={plateCardStyles.sectionHeadingTitle}>
                    Secuencia sugerida para prepararlo como lo haria QART
                  </h4>
                </div>
                <strong className={plateCardStyles.sectionHeadingMeta}>
                  {guide.steps.length} pasos
                </strong>
              </div>

              <div className={plateCardStyles.recipeStepList}>
                {guide.steps.map((step, index) => (
                  <article key={step.id} className={plateCardStyles.recipeStepCard}>
                    <div className={plateCardStyles.recipeStepHead}>
                      <span className={plateCardStyles.recipeStepNumber}>{index + 1}</span>
                      <div>
                        <h5 className={plateCardStyles.sectionHeadingTitle}>{step.title}</h5>
                        <p className={plateCardStyles.note}>{step.body}</p>
                      </div>
                    </div>

                    {step.note ? <p className={plateCardStyles.note}>{step.note}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default PlateRecipeModal;
