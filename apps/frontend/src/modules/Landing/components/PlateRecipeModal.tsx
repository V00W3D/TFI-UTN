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
import { useState } from 'react';
import Portal from '../../../components/shared/Portal';
import {
  PlateDataIcon,
  PlateDifficultyIcon,
  StarRatingDisplay,
} from '../../../components/shared/PlateDataIcons';
import {
  formatLandingEnum,
  formatLandingMetric,
  formatLandingPrice,
  getPlateRecipeGuide,
  type LandingPlate,
} from './landingPlateNutrition';

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
        className="featured-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="featured-modal featured-modal--recipe"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="featured-modal-header">
            <div className="featured-modal-identity">
              <p className="featured-kicker">Receta abierta</p>
              <h3 className="featured-modal-title">{plate.name}</h3>
              <p className="featured-modal-description">{guide.summary}</p>

              <div className="featured-modal-meta">
                <span className="featured-chip featured-chip--accent">
                  {formatLandingPrice(plate.menuPrice)}
                </span>
                <span className="featured-chip">
                  {guide.servings === 1 ? '1 porcion' : `${guide.servings} porciones`}
                </span>
                {guide.prepTimeMinutes != null && (
                  <span className="featured-chip">
                    {formatLandingMetric(guide.prepTimeMinutes, 'min', 0)} de prep
                  </span>
                )}
                {guide.cookTimeMinutes != null && (
                  <span className="featured-chip">
                    {formatLandingMetric(guide.cookTimeMinutes, 'min', 0)} de coccion
                  </span>
                )}
              </div>
            </div>

            <button type="button" className="featured-close-button" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="featured-modal-scroll">
            <section className="featured-modal-section">
              <div className="featured-modal-hero">
                <div
                  className={`featured-modal-media${
                    hasMediaImage ? ' featured-modal-media--with-image' : ''
                  }`}
                >
                  {hasMediaImage ? (
                    <img
                      src={plate.imageUrl!}
                      alt={plate.name}
                      className="featured-modal-media-image"
                      loading="lazy"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <div className="featured-modal-media-fallback">
                      <PlateDataIcon icon="recipe" className="featured-modal-media-fallback-icon" />
                      <span>Vista del plato</span>
                    </div>
                  )}
                </div>

                <div className="featured-modal-hero-panel">
                  <div className="featured-section-heading">
                    <div>
                      <p className="featured-kicker">Lectura de cocina</p>
                      <h4>Como prepara QART este plato para que salga igual de tentador</h4>
                    </div>
                  </div>

                  <div className="featured-modal-hero-meta">
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Tipo</span>
                      <strong className="featured-metric-value">
                        {formatLandingEnum(plate.recipe.type)}
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Tamano</span>
                      <strong className="featured-metric-value">
                        {formatLandingEnum(plate.size)}
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Dificultad</span>
                      <strong className="featured-metric-value featured-metric-value--icon">
                        <PlateDifficultyIcon
                          difficulty={plate.recipe.difficulty}
                          className="featured-modal-difficulty"
                        />
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Valoracion</span>
                      <strong className="featured-metric-value featured-metric-value--stack">
                        <StarRatingDisplay
                          className="featured-star-rating"
                          value={plate.avgRating}
                          size={16}
                        />
                      </strong>
                    </div>
                  </div>

                  <div className="featured-stack">
                    {plate.recipe.assemblyNotes ? (
                      <p className="featured-note">{plate.recipe.assemblyNotes}</p>
                    ) : null}
                    <p className="featured-note">
                      Ingredientes finales con gramos reales y una secuencia simple para replicarlo
                      en casa.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="featured-modal-section">
              <div className="featured-section-heading">
                <div>
                  <p className="featured-kicker">Ingredientes</p>
                  <h4>Lo que necesita esta version del plato</h4>
                </div>
                <strong>{guide.ingredients.length} ingredientes finales</strong>
              </div>

              <div className="featured-recipe-ingredient-grid">
                {guide.ingredients.map((ingredient) => (
                  <article key={ingredient.id} className="featured-recipe-card">
                    <div className="featured-recipe-card-head">
                      <span className="featured-recipe-icon-box">
                        <PlateDataIcon icon={ingredient.icon} className="featured-recipe-icon" />
                      </span>
                      <div>
                        <p className="featured-subcard-eyebrow">{ingredient.categoryLabel}</p>
                        <h5>{ingredient.name}</h5>
                      </div>
                    </div>

                    <div className="featured-recipe-ingredient-meta">
                      <div className="featured-recipe-pill">
                        <span>Gramos reales</span>
                        <strong>{formatLandingMetric(ingredient.quantityGrams, 'g', 0)}</strong>
                      </div>
                      <div className="featured-recipe-pill">
                        <span>Rol</span>
                        <strong>{ingredient.isMainComponent ? 'Principal' : 'Armado'}</strong>
                      </div>
                    </div>

                    <div className="featured-chip-row">
                      {ingredient.variants.map((variant) => (
                        <span key={variant} className="featured-chip featured-chip--accent">
                          {variant}
                        </span>
                      ))}
                      {ingredient.preparations.map((preparation) => (
                        <span key={preparation} className="featured-chip">
                          {preparation}
                        </span>
                      ))}
                    </div>

                    {ingredient.note ? <p className="featured-note">{ingredient.note}</p> : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="featured-modal-section">
              <div className="featured-section-heading">
                <div>
                  <p className="featured-kicker">Paso a paso</p>
                  <h4>Secuencia sugerida para prepararlo como lo haria QART</h4>
                </div>
                <strong>{guide.steps.length} pasos</strong>
              </div>

              <div className="featured-recipe-step-list">
                {guide.steps.map((step, index) => (
                  <article key={step.id} className="featured-recipe-step-card">
                    <div className="featured-recipe-step-head">
                      <span className="featured-recipe-step-number">{index + 1}</span>
                      <div>
                        <h5>{step.title}</h5>
                        <p className="featured-note">{step.body}</p>
                      </div>
                    </div>

                    {step.note ? <p className="featured-note">{step.note}</p> : null}
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
