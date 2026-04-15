import { useState } from 'react';
import {
  PlateDataIcon,
  PlateDifficultyIcon,
  StarRatingDisplay,
  getPlateSizeIconKey,
  getPlateTypeIconKey,
} from '@/shared/ui/PlateDataIcons';
import type { LandingPlate } from '@/shared/utils/plateNutrition';
import { formatLandingEnum, formatLandingPrice } from '@/shared/utils/plateNutrition';
import { CartIcon } from '@/shared/ui/PlateCard/components/CardIcons';
import { featuredChipStyles, plateCardStyles } from '@/styles/modules/plateCard';

interface FeaturedCardProps {
  plate: LandingPlate;
  onAdd: (qty: number) => void;
  onNutrition?: (() => void) | undefined;
  onRecipe?: (() => void) | undefined;
}

export const FeaturedCard = ({ plate, onAdd, onNutrition, onRecipe }: FeaturedCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasImage = Boolean(plate.imageUrl && !imageFailed);

  return (
    <article className={plateCardStyles.featuredCard}>
      <div className={plateCardStyles.featuredMedia}>
        {hasImage && (
          <img
            src={plate.imageUrl!}
            alt={plate.name}
            className={plateCardStyles.featuredMediaImage}
            onError={() => setImageFailed(true)}
          />
        )}
        <div className={plateCardStyles.featuredMediaOverlay} />
        <div className={plateCardStyles.featuredMediaBadge}>
          {plate.isAvailable ? 'Disponible' : 'Fuera de carta'}
        </div>

        <div className={plateCardStyles.featuredMediaCopy}>
          <div className={plateCardStyles.featuredMediaSymbol}>
            <PlateDataIcon icon={getPlateTypeIconKey(plate.recipe.type)} width={20} height={20} />
          </div>
          <div className={plateCardStyles.featuredMediaDifficulty}>
            <PlateDifficultyIcon difficulty={plate.recipe.difficulty} width={48} height={20} />
          </div>
        </div>

        <div className={plateCardStyles.featuredMediaSignature}>
          <span className={plateCardStyles.featuredMediaSignatureLabel}>Tamaño</span>
          <strong>
            <PlateDataIcon icon={getPlateSizeIconKey(plate.size)} width={24} height={24} />
          </strong>
        </div>

        <div className={plateCardStyles.featuredFloatingActions}>
          <button
            type="button"
            className={plateCardStyles.iconButton}
            onClick={onNutrition}
            title="Info Nutricional"
          >
            <PlateDataIcon icon="info" width={16} height={16} />
          </button>
          <button
            type="button"
            className={plateCardStyles.iconButton}
            onClick={onRecipe}
            title="Receta"
          >
            <PlateDataIcon icon="recipe" width={16} height={16} />
          </button>
        </div>
      </div>

      <div className={plateCardStyles.featuredContent}>
        <div className={plateCardStyles.featuredTopLine}>
          <div className={plateCardStyles.featuredChips}>
            <span className={featuredChipStyles({ tone: 'accent' })}>
              {formatLandingEnum(plate.recipe.type)}
            </span>
            <span className={featuredChipStyles()}>{formatLandingEnum(plate.size)}</span>
          </div>
          <div className={plateCardStyles.featuredRatingPill}>
            <div className={plateCardStyles.featuredRatingMeta}>
              <strong>{plate.avgRating.toFixed(1)}</strong>
              <span>({plate.ratingsCount})</span>
            </div>
            <StarRatingDisplay value={plate.avgRating} size={18} showValue={false} />
          </div>
        </div>

        <div className={plateCardStyles.featuredCopy}>
          <h3 className={plateCardStyles.featuredTitle}>{plate.name}</h3>
          <p className={plateCardStyles.featuredDescription}>
            {plate.description || 'Sin descripción disponible.'}
          </p>
        </div>

        <div className={plateCardStyles.featuredStory}>
          <p className={plateCardStyles.featuredQuote}>
            "
            {plate.recipe.assemblyNotes ||
              plate.recipe.description ||
              'Una joya arquitectónica en cada bocado.'}
            "
          </p>
        </div>

        <div className={plateCardStyles.featuredFooter}>
          <div>
            <span className={plateCardStyles.featuredPriceLabel}>Precio Final</span>
            <strong className={plateCardStyles.featuredPriceValue}>
              {formatLandingPrice(plate.menuPrice)}
            </strong>
          </div>
          <div className={plateCardStyles.quantityControl}>
            <button
              type="button"
              className={plateCardStyles.quantityButton}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <input
              type="number"
              className={plateCardStyles.quantityInput}
              value={quantity}
              readOnly
            />
            <button
              type="button"
              className={plateCardStyles.quantityButton}
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          className={plateCardStyles.featuredAddButton}
          onClick={handleAdd}
          disabled={!plate.isAvailable}
        >
          <CartIcon width={20} height={20} />
          <span>{added ? '¡AÑADIDO!' : 'AÑADIR A LA ORDEN'}</span>
        </button>
      </div>
    </article>
  );
};
