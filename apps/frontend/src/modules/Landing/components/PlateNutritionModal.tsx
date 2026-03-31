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
  getPlateIngredientAnalysis,
  selectFeaturedMetrics,
  type LandingPlate,
} from './landingPlateNutrition';

interface PlateNutritionModalProps {
  plate: LandingPlate;
  onClose: () => void;
}

const renderEnumChips = (items: string[]) =>
  items.map((item) => (
    <span key={item} className="featured-chip">
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
        className="featured-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="featured-modal featured-modal--nutrition"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="featured-modal-header">
            <div className="featured-modal-identity">
              <p className="featured-kicker">Ficha nutricional</p>
              <h3 className="featured-modal-title">{plate.name}</h3>
              <p className="featured-modal-description">{leadCopy}</p>

              <div className="featured-modal-meta">
                <span className="featured-chip featured-chip--accent">
                  {formatLandingPrice(plate.menuPrice)}
                </span>
                <span className="featured-chip">
                  {formatLandingMetric(plate.servedWeightGrams, 'g', 0)}
                </span>
                <span className="featured-chip">
                  {analysis.servings === 1
                    ? '1 porcion servida'
                    : `${analysis.servings} porciones`}
                </span>
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
                      <p className="featured-kicker">Lectura general</p>
                      <h4>{analysis.marketingHeadline}</h4>
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
                    <p className="featured-note">
                      Los valores se calculan sobre la porcion final servida y se comparan contra
                      referencias diarias para que la lectura sea clara.
                    </p>
                    <p className="featured-note">
                      Si queres ver ingredientes, gramos reales y paso a paso, abrí la vista
                      &quot;Receta&quot; desde la card.
                    </p>

                    <div className="featured-chip-row">
                      {renderEnumChips(plate.dietaryTags)}
                      {renderEnumChips(plate.nutritionTags)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {heroMetrics.length > 0 && (
              <section className="featured-modal-section">
                <div className="featured-section-heading">
                  <div>
                    <p className="featured-kicker">Señales grandes</p>
                    <h4>Lo mas importante del plato sin perder de vista el antojo</h4>
                  </div>
                  <strong>Lectura resumida</strong>
                </div>

                <div className="featured-nutrition-hero-grid">
                  {heroMetrics.map((metric) => (
                    <article
                      key={metric.key}
                      className={`featured-nutrition-hero-card insight-tone-${metric.tone}`}
                    >
                      <div className="featured-nutrition-hero-card-head">
                        <span className="featured-nutrition-icon-box">
                          <PlateDataIcon
                            icon={metric.icon}
                            className="featured-nutrition-hero-icon"
                          />
                        </span>
                        <span className="featured-nutrition-tone">{metric.label}</span>
                      </div>

                      <div className="featured-nutrition-hero-card-copy">
                        <strong>{metric.totalValue}</strong>
                        <span>Total del plato</span>
                      </div>

                      <div className="featured-nutrition-hero-card-copy featured-nutrition-hero-card-copy--secondary">
                        <strong>{metric.perPortionValue}</strong>
                        <span>Por porcion servida</span>
                      </div>

                      <p className="featured-note">{metric.note}</p>
                      <p className="featured-note">{metric.dailyValueLabel}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="featured-modal-section">
              <div className="featured-section-heading">
                <div>
                  <p className="featured-kicker">Ficha completa</p>
                  <h4>Todos los totales nutricionales visibles para esta porcion</h4>
                </div>
                <strong>{analysis.totalMetrics.length} metricas</strong>
              </div>

              <div className="featured-total-grid">
                {analysis.totalMetrics.map((metric) => (
                  <article
                    key={metric.key}
                    className={`featured-total-card insight-tone-${metric.tone}`}
                  >
                    <div className="featured-total-card-head">
                      <PlateDataIcon icon={metric.icon} className="featured-total-card-icon" />
                      <span>{metric.label}</span>
                    </div>
                    <strong>{metric.totalValue}</strong>
                    <small>{metric.perPortionValue} por porcion</small>
                    <p className="featured-note">{metric.note}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="featured-modal-section">
              <div className="featured-section-heading">
                <div>
                  <p className="featured-kicker">Tabla base</p>
                  <h4>Valores de referencia usados para leer lo que si tiene objetivo diario claro</h4>
                </div>
                <strong>Base de referencia</strong>
              </div>

              <div className="featured-reference-table-shell">
                <table className="featured-reference-table">
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
                      <tr key={row.key} className={`insight-tone-${row.tone}`}>
                        <td>
                          <div className="featured-reference-metric">
                            <PlateDataIcon icon={row.icon} className="featured-reference-icon" />
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
                          <span className="featured-reference-source">{row.sourceLabel}</span>
                          <p className="featured-note">{row.note}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="featured-reference-notes">
                {analysis.qualitativeReferenceNotes.map((note) => (
                  <p key={note} className="featured-note">
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
