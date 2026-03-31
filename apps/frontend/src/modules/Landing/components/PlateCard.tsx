import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  formatEnum,
  formatPrice,
  getCardNarrative,
  getGuideBadges,
  getInsightToneClass,
  getPreviewIngredients,
  plateDetailSections,
  type Plate,
  type PlateCardEmphasis,
  type PlateDetailSection,
} from './platePresentation';

interface PlateCardProps {
  plate: Plate;
  emphasis?: PlateCardEmphasis;
  index?: number;
  onOpenSection: (plate: Plate, section: PlateDetailSection) => void;
}

const PlateCard = ({ plate, emphasis = 'regular', index = 0, onOpenSection }: PlateCardProps) => {
  const guideBadges = getGuideBadges(plate);
  const [imageFailed, setImageFailed] = useState(false);
  const hasMediaImage = Boolean(plate.imageUrl && !imageFailed);

  return (
    <motion.article
      className={`featured-card featured-card--${emphasis}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <div
        className={`featured-card-media${hasMediaImage ? ' featured-card-media--with-image' : ''}`}
      >
        {hasMediaImage && (
          <img
            src={plate.imageUrl!}
            alt={plate.name}
            className="featured-card-media-image"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="featured-card-media-overlay" />
        <div className="featured-card-media-badge">
          {plate.isAvailable ? 'Disponible' : 'Fuera de carta'}
        </div>
        <div className="featured-card-media-lines" />
        <div className="featured-card-media-copy">
          <span>{formatEnum(plate.recipe.type)}</span>
          <span>{formatEnum(plate.recipe.flavor)}</span>
        </div>
        <div className="featured-card-media-signature">
          <span>Plato QART</span>
          <strong>{formatEnum(plate.size)}</strong>
        </div>
      </div>

      <div className="featured-card-content">
        <div className="featured-card-topline">
          <div className="featured-chip-row">
            <span className="featured-chip featured-chip--accent">{formatEnum(plate.size)}</span>
            <span className="featured-chip">{formatEnum(plate.recipe.difficulty)}</span>
          </div>

          <div className="featured-rating-pill">
            <strong>{plate.avgRating.toFixed(1)}</strong>
            <span>{plate.ratingsCount} reseñas</span>
          </div>
        </div>

        <div className="featured-card-copy">
          <h3>{plate.name}</h3>
          <p>{plate.description || 'Este plato todavía no tiene descripción.'}</p>
        </div>

        <div className="featured-card-guide">
          <p className="featured-preview-copy">{getCardNarrative(plate)}</p>

          <div className="featured-chip-row">
            {guideBadges.map((badge) => (
              <span
                key={badge.label}
                className={`insight-pill ${getInsightToneClass(badge.tone)}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <p className="featured-preview-copy">{getPreviewIngredients(plate)}</p>
        </div>

        <div className="featured-card-footer">
          <div>
            <span className="featured-price-label">Precio</span>
            <strong className="featured-price-value">{formatPrice(plate.menuPrice)}</strong>
          </div>

          <div className="featured-card-footer-meta">
            <span>{plate.recipe.items.length} componentes</span>
            <span>{plate.adjustments.length} ajustes</span>
          </div>
        </div>

        <div className="featured-card-actions">
          {plateDetailSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="featured-card-action"
              onClick={() => onOpenSection(plate, section.id)}
            >
              {section.shortLabel}
            </button>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

export default PlateCard;
