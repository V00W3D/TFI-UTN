import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Portal from '../../../components/shared/Portal';
import PlateCard from './PlateCard';
import {
  formatDate,
  formatEnum,
  formatMetric,
  formatPrice,
  getInsightToneClass,
  getNutritionInsights,
  getNutritionMetricCards,
  getPreviewIngredients,
  getReviewHeadline,
  hasOverrideNutrition,
  plateDetailSections,
  type Plate,
  type PlateDetailSection,
  type PlateLayout,
} from './platePresentation';

interface PlateCardsRendererProps {
  plates: Plate[];
  layout?: PlateLayout;
}

interface PlateInspectorState {
  plateId: string;
  section: PlateDetailSection;
}

const renderEnumTags = (items: string[], emptyLabel: string) =>
  items.length > 0 ? (
    items.map((item) => (
      <span key={item} className="featured-chip">
        {formatEnum(item)}
      </span>
    ))
  ) : (
    <span className="featured-chip featured-chip--muted">{emptyLabel}</span>
  );

const renderTextTags = (items: Array<{ id: string; name: string }>, emptyLabel: string) =>
  items.length > 0 ? (
    items.map((item) => (
      <span key={item.id} className="featured-chip featured-chip--accent">
        {item.name}
      </span>
    ))
  ) : (
    <span className="featured-chip featured-chip--muted">{emptyLabel}</span>
  );

const PlateInspectorModal = ({
  plate,
  activeSection,
  onChangeSection,
  onClose,
}: {
  plate: Plate;
  activeSection: PlateDetailSection;
  onChangeSection: (section: PlateDetailSection) => void;
  onClose: () => void;
}) => {
  const nutritionInsights = getNutritionInsights(plate);
  const nutritionMetricCards = getNutritionMetricCards(plate);
  const activeMeta = plateDetailSections.find((section) => section.id === activeSection);

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
          className="featured-modal"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="featured-modal-header">
            <div className="featured-modal-identity">
              <p className="featured-kicker">Detalle del plato</p>
              <h3 className="featured-modal-title">{plate.name}</h3>
              <p className="featured-modal-description">
                {plate.description || 'Sin descripción adicional para esta ficha.'}
              </p>

              <div className="featured-modal-meta">
                <span className="featured-chip featured-chip--accent">{formatEnum(plate.size)}</span>
                <span className="featured-chip">{formatEnum(plate.recipe.flavor)}</span>
                <span className="featured-chip">{formatPrice(plate.menuPrice)}</span>
                <span className="featured-chip">{plate.avgRating.toFixed(1)} / 5</span>
              </div>
            </div>

            <button type="button" className="featured-close-button" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="featured-inspector-tabs">
            {plateDetailSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`featured-inspector-tab ${
                  activeSection === section.id ? 'featured-inspector-tab--active' : ''
                }`}
                onClick={() => onChangeSection(section.id)}
              >
                {section.shortLabel}
              </button>
            ))}
          </div>

          <div className="featured-modal-scroll">
            <motion.section
              key={activeSection}
              className="featured-modal-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="featured-section-heading">
                <div>
                  <p className="featured-kicker">{activeMeta?.label}</p>
                  <h4>{activeMeta?.description}</h4>
                </div>
              </div>

              {activeSection === 'guide' && (
                <>
                  <div className="featured-hero-grid">
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Precio</span>
                      <strong className="featured-metric-value">{formatPrice(plate.menuPrice)}</strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Peso servido</span>
                      <strong className="featured-metric-value">
                        {formatMetric(plate.servedWeightGrams, 'g', 0)}
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Valoración</span>
                      <strong className="featured-metric-value">
                        {plate.avgRating.toFixed(1)} / 5
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Receta base</span>
                      <strong className="featured-metric-value">{plate.recipe.name}</strong>
                    </div>
                  </div>

                  <div className="featured-insight-grid">
                    {nutritionInsights.slice(0, 3).map((insight) => (
                      <article
                        key={insight.key}
                        className={`insight-panel ${getInsightToneClass(insight.tone)}`}
                      >
                        <span className="insight-panel-label">{insight.label}</span>
                        <strong className="insight-panel-title">{insight.headline}</strong>
                        <span className="insight-panel-value">{insight.value}</span>
                        <p className="insight-panel-copy">{insight.detail}</p>
                      </article>
                    ))}
                  </div>

                  <div className="featured-stack">
                    <article className="featured-subcard">
                      <div className="featured-subcard-header">
                        <div>
                          <p className="featured-subcard-eyebrow">Lectura rápida</p>
                          <h5>Qué mirar primero</h5>
                        </div>
                      </div>
                      <p className="featured-note">{getPreviewIngredients(plate, 4)}</p>
                      {plate.nutritionNotes && <p className="featured-note">{plate.nutritionNotes}</p>}
                    </article>

                    <article className="featured-subcard">
                      <div className="featured-subcard-header">
                        <div>
                          <p className="featured-subcard-eyebrow">Etiquetas</p>
                          <h5>Etiquetas del plato</h5>
                        </div>
                      </div>
                      <div className="featured-tag-group">
                        <span className="featured-group-label">Dietarios</span>
                        <div className="featured-chip-row">
                          {renderEnumTags(plate.dietaryTags, 'Sin etiquetas dietarias')}
                        </div>
                      </div>
                      <div className="featured-tag-group">
                        <span className="featured-group-label">Nutricionales</span>
                        <div className="featured-chip-row">
                          {renderEnumTags(plate.nutritionTags, 'Sin etiquetas nutricionales')}
                        </div>
                      </div>
                      <div className="featured-tag-group">
                        <span className="featured-group-label">Menú</span>
                        <div className="featured-chip-row">
                          {renderTextTags(plate.tags, 'Sin etiquetas de carta')}
                        </div>
                      </div>
                      <div className="featured-tag-group">
                        <span className="featured-group-label">Alérgenos</span>
                        <div className="featured-chip-row">
                          {renderEnumTags(plate.allergens, 'Sin alérgenos declarados')}
                        </div>
                      </div>
                    </article>
                  </div>
                </>
              )}

              {activeSection === 'nutrition' && (
                <>
                  <div className="featured-insight-grid">
                    {nutritionInsights.map((insight) => (
                      <article
                        key={insight.key}
                        className={`insight-panel ${getInsightToneClass(insight.tone)}`}
                      >
                        <span className="insight-panel-label">{insight.label}</span>
                        <strong className="insight-panel-title">{insight.headline}</strong>
                        <span className="insight-panel-value">{insight.value}</span>
                        <p className="insight-panel-copy">{insight.detail}</p>
                      </article>
                    ))}
                  </div>

                  <div className="featured-data-grid">
                    {nutritionMetricCards.map((metric) => (
                      <article
                        key={metric.key}
                        className={`featured-metric-card featured-metric-card--narrative ${getInsightToneClass(metric.tone)}`}
                      >
                        <span className="featured-metric-label">{metric.label}</span>
                        <strong className="featured-metric-value">{metric.value}</strong>
                        <p className="featured-note">{metric.detail}</p>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {activeSection === 'recipe' && (
                <>
                  <div className="featured-metric-grid featured-metric-grid--compact">
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Tipo</span>
                      <strong className="featured-metric-value">{formatEnum(plate.recipe.type)}</strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Sabor</span>
                      <strong className="featured-metric-value">
                        {formatEnum(plate.recipe.flavor)}
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Dificultad</span>
                      <strong className="featured-metric-value">
                        {formatEnum(plate.recipe.difficulty)}
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Prep</span>
                      <strong className="featured-metric-value">
                        {formatMetric(plate.recipe.prepTimeMinutes, 'min', 0)}
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Cocción</span>
                      <strong className="featured-metric-value">
                        {formatMetric(plate.recipe.cookTimeMinutes, 'min', 0)}
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Rinde</span>
                      <strong className="featured-metric-value">
                        {formatMetric(plate.recipe.yieldServings, 'porciones', 0)}
                      </strong>
                    </div>
                  </div>

                  <article className="featured-subcard">
                    <div className="featured-subcard-header">
                      <div>
                        <p className="featured-subcard-eyebrow">Armado</p>
                        <h5>{plate.recipe.name}</h5>
                      </div>
                    </div>
                    <p className="featured-note">
                      {plate.recipe.description || 'La receta no tiene una descripción adicional.'}
                    </p>
                    {plate.recipe.assemblyNotes && (
                      <p className="featured-note">{plate.recipe.assemblyNotes}</p>
                    )}
                  </article>

                  <div className="featured-stack">
                    <article className="featured-subcard">
                      <div className="featured-subcard-header">
                        <div>
                          <p className="featured-subcard-eyebrow">Dieta</p>
                          <h5>Marcadores de receta</h5>
                        </div>
                      </div>
                      <div className="featured-chip-row">
                        {renderEnumTags(plate.recipe.dietaryTags, 'Sin etiquetas dietarias')}
                      </div>
                    </article>

                    <article className="featured-subcard">
                      <div className="featured-subcard-header">
                        <div>
                          <p className="featured-subcard-eyebrow">Alérgenos</p>
                          <h5>Señales de cocina</h5>
                        </div>
                      </div>
                      <div className="featured-chip-row">
                        {renderEnumTags(plate.recipe.allergens, 'Sin alérgenos adicionales')}
                      </div>
                    </article>
                  </div>
                </>
              )}

              {activeSection === 'components' && (
                <div className="featured-stack">
                  {plate.recipe.items.map((item) => (
                    <article key={item.id} className="featured-subcard">
                      <div className="featured-subcard-header">
                        <div>
                          <p className="featured-subcard-eyebrow">
                            Orden {item.sortOrder + 1}
                            {item.isMainComponent ? ' · Principal' : ''}
                            {item.isOptional ? ' · Opcional' : ''}
                          </p>
                          <h5>{item.variant.name}</h5>
                          <p className="featured-subcard-copy">
                            {item.variant.ingredient.name} · {formatEnum(item.variant.ingredient.category)}
                            {item.variant.ingredient.subCategory
                              ? ` · ${item.variant.ingredient.subCategory}`
                              : ''}
                          </p>
                        </div>

                        <div className="featured-chip-row">
                          <span className="featured-chip">
                            {formatMetric(item.quantityGrams, 'g', 0)}
                          </span>
                          <span className="featured-chip">
                            {formatEnum(item.variant.preparationMethod)}
                          </span>
                          {item.variant.isDefault && (
                            <span className="featured-chip featured-chip--accent">
                              Variante base
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="featured-note">
                        {item.prepNotes ||
                          item.variant.preparationNotes ||
                          item.variant.description ||
                          item.variant.ingredient.description ||
                          'Sin observaciones adicionales para este componente.'}
                      </p>

                      <div className="featured-metric-grid featured-metric-grid--compact">
                        <div className="featured-metric-card">
                          <span className="featured-metric-label">Base</span>
                          <strong className="featured-metric-value">
                            {formatMetric(item.variant.ingredient.nutritionBasisGrams, 'g', 0)}
                          </strong>
                        </div>
                        <div className="featured-metric-card">
                          <span className="featured-metric-label">Porción variante</span>
                          <strong className="featured-metric-value">
                            {formatMetric(item.variant.portionGrams, 'g', 0)}
                          </strong>
                        </div>
                        <div className="featured-metric-card">
                          <span className="featured-metric-label">Factor de rendimiento</span>
                          <strong className="featured-metric-value">
                            {formatMetric(item.variant.yieldFactor, 'x', 2)}
                          </strong>
                        </div>
                        <div className="featured-metric-card">
                          <span className="featured-metric-label">Sabor dominante</span>
                          <strong className="featured-metric-value">
                            {formatEnum(item.variant.ingredient.primaryFlavor)}
                          </strong>
                        </div>
                      </div>

                      <div className="featured-subsection">
                        <h6>Base nutricional del ingrediente</h6>
                        <div className="featured-metric-grid featured-metric-grid--compact">
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Calorías</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.calories, 'kcal', 0)}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Proteínas</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.proteins, 'g', 1)}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Carbohidratos</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.carbs, 'g', 1)}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Grasas</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.fats, 'g', 1)}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Fibra</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.fiber, 'g', 1)}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Azúcares</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.sugars, 'g', 1)}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Sodio</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.sodium, 'mg', 0)}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Saturadas</span>
                            <strong className="featured-metric-value">
                              {formatMetric(
                                item.variant.ingredient.nutrition.saturatedFat,
                                'g',
                                1,
                              )}
                            </strong>
                          </div>
                          <div className="featured-metric-card">
                            <span className="featured-metric-label">Trans</span>
                            <strong className="featured-metric-value">
                              {formatMetric(item.variant.ingredient.nutrition.transFat, 'g', 1)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="featured-chip-row">
                        {renderEnumTags(
                          item.variant.ingredient.dietaryTags,
                          'Sin etiquetas dietarias',
                        )}
                        {renderEnumTags(
                          item.variant.ingredient.nutritionTags,
                          'Sin etiquetas nutricionales',
                        )}
                        {renderEnumTags(item.variant.ingredient.allergens, 'Sin alérgenos declarados')}
                      </div>

                      {hasOverrideNutrition(item.variant.overrideNutrition) && (
                        <div className="featured-subsection">
                          <h6>Ajuste nutricional de la variante</h6>
                          <div className="featured-metric-grid featured-metric-grid--compact">
                            <div className="featured-metric-card">
                              <span className="featured-metric-label">Calorías</span>
                              <strong className="featured-metric-value">
                                {formatMetric(item.variant.overrideNutrition.calories, 'kcal', 0)}
                              </strong>
                            </div>
                            <div className="featured-metric-card">
                              <span className="featured-metric-label">Proteínas</span>
                              <strong className="featured-metric-value">
                                {formatMetric(item.variant.overrideNutrition.proteins, 'g', 1)}
                              </strong>
                            </div>
                            <div className="featured-metric-card">
                              <span className="featured-metric-label">Carbohidratos</span>
                              <strong className="featured-metric-value">
                                {formatMetric(item.variant.overrideNutrition.carbs, 'g', 1)}
                              </strong>
                            </div>
                            <div className="featured-metric-card">
                              <span className="featured-metric-label">Grasas</span>
                              <strong className="featured-metric-value">
                                {formatMetric(item.variant.overrideNutrition.fats, 'g', 1)}
                              </strong>
                            </div>
                            <div className="featured-metric-card">
                              <span className="featured-metric-label">Fibra</span>
                              <strong className="featured-metric-value">
                                {formatMetric(item.variant.overrideNutrition.fiber, 'g', 1)}
                              </strong>
                            </div>
                            <div className="featured-metric-card">
                              <span className="featured-metric-label">Sodio</span>
                              <strong className="featured-metric-value">
                                {formatMetric(item.variant.overrideNutrition.sodium, 'mg', 0)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.variant.ingredient.notes && (
                        <p className="featured-note">{item.variant.ingredient.notes}</p>
                      )}

                      {item.variant.ingredient.extraAttributes && (
                        <pre className="featured-json">
                          {JSON.stringify(item.variant.ingredient.extraAttributes, null, 2)}
                        </pre>
                      )}
                    </article>
                  ))}

                  <article className="featured-subcard">
                    <div className="featured-subcard-header">
                      <div>
                        <p className="featured-subcard-eyebrow">Ajustes</p>
                        <h5>
                          {plate.adjustments.length > 0
                            ? `${plate.adjustments.length} modificaciones del plato final`
                            : 'Sin ajustes adicionales'}
                        </h5>
                      </div>
                    </div>

                    {plate.adjustments.length > 0 ? (
                      <div className="featured-stack">
                        {plate.adjustments.map((adjustment) => (
                          <article key={adjustment.id} className="featured-subcard featured-subcard--inner">
                            <div className="featured-subcard-header">
                              <div>
                                <p className="featured-subcard-eyebrow">
                                  Orden {adjustment.sortOrder + 1}
                                </p>
                                <h5>{formatEnum(adjustment.adjustmentType)}</h5>
                                <p className="featured-subcard-copy">
                                  {adjustment.variant?.name ||
                                    adjustment.recipeItem?.variant.name ||
                                    'Ajuste sin variante asociada'}
                                </p>
                              </div>
                              <div className="featured-chip-row">
                                <span className="featured-chip">
                                  {formatMetric(adjustment.quantityGrams, 'g', 0)}
                                </span>
                              </div>
                            </div>

                            {adjustment.notes && <p className="featured-note">{adjustment.notes}</p>}
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="featured-note">
                        Este plato no declara modificaciones extra sobre la receta base.
                      </p>
                    )}
                  </article>
                </div>
              )}

              {activeSection === 'reviews' && (
                <>
                  <div className="featured-review-summary">
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Lectura</span>
                      <strong className="featured-metric-value">{getReviewHeadline(plate)}</strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Reseñas</span>
                      <strong className="featured-metric-value">{plate.ratingsCount}</strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Promedio</span>
                      <strong className="featured-metric-value">
                        {plate.avgRating.toFixed(1)} / 5
                      </strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">Me gusta</span>
                      <strong className="featured-metric-value">{plate.likesCount}</strong>
                    </div>
                    <div className="featured-metric-card">
                      <span className="featured-metric-label">No me gusta</span>
                      <strong className="featured-metric-value">{plate.dislikesCount}</strong>
                    </div>
                  </div>

                  {plate.reviews.length > 0 ? (
                    <div className="featured-stack">
                      {plate.reviews.map((review) => (
                        <article key={review.id} className="featured-subcard">
                          <div className="featured-subcard-header">
                            <div>
                              <p className="featured-subcard-eyebrow">
                                {formatDate(review.createdAt)}
                              </p>
                              <h5>{formatMetric(review.rating, '/ 5', 1)}</h5>
                            </div>

                            <span className="featured-chip">
                              {review.recommends == null
                                ? 'Sin preferencia'
                                : review.recommends
                                  ? 'Lo recomienda'
                                  : 'No lo recomienda'}
                            </span>
                          </div>

                          <p className="featured-note">
                            {review.comment || 'Esta reseña no incluye comentario.'}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="featured-note">
                      Aún no hay reseñas públicas para este plato, pero la ficha completa ya está
                      disponible.
                    </p>
                  )}
                </>
              )}
            </motion.section>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
};

const PlateCardsRenderer = ({ plates, layout = 'grid' }: PlateCardsRendererProps) => {
  const [inspector, setInspector] = useState<PlateInspectorState | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!inspector) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInspector(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspector]);

  const selectedPlate = inspector
    ? plates.find((plate) => plate.id === inspector.plateId) ?? null
    : null;

  const openSection = (plate: Plate, section: PlateDetailSection) => {
    setInspector({ plateId: plate.id, section });
  };

  const scrollTrack = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.78, 320),
      behavior: 'smooth',
    });
  };

  const renderCards = (items: Plate[], emphasis: 'regular' | 'featured' | 'compact' = 'regular') =>
    items.map((plate, index) => (
      <PlateCard
        key={plate.id}
        plate={plate}
        emphasis={emphasis}
        index={index}
        onOpenSection={openSection}
      />
    ));

  return (
    <>
      {layout === 'grid' && <div className="plate-collection plate-collection--grid">{renderCards(plates)}</div>}

      {layout === 'one-row' && (
        <div ref={trackRef} className="plate-collection plate-collection--one-row">
          {renderCards(plates)}
        </div>
      )}

      {layout === 'carousel' && (
        <div className="plate-carousel-shell">
          <div className="plate-carousel-controls">
            <button type="button" className="btn-outline" onClick={() => scrollTrack(-1)}>
              Anterior
            </button>
            <button type="button" className="btn-outline" onClick={() => scrollTrack(1)}>
              Siguiente
            </button>
          </div>

          <div ref={trackRef} className="plate-collection plate-collection--carousel">
            {renderCards(plates)}
          </div>
        </div>
      )}

      {layout === 'group' && (
        <div className="plate-collection plate-collection--group">
          {plates[0] && <div className="plate-group-primary">{renderCards([plates[0]], 'featured')}</div>}
          {plates.length > 1 && (
            <div className="plate-group-secondary">{renderCards(plates.slice(1), 'compact')}</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedPlate && inspector && (
          <PlateInspectorModal
            plate={selectedPlate}
            activeSection={inspector.section}
            onChangeSection={(section) =>
              setInspector((current) =>
                current ? { plateId: current.plateId, section } : current,
              )
            }
            onClose={() => setInspector(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PlateCardsRenderer;
