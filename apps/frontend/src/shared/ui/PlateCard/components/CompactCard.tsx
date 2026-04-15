import { useState } from 'react';
import { StarRatingDisplay, PlateDataIcon } from '@/shared/ui/PlateDataIcons';
import type { LandingPlate } from '@/shared/utils/plateNutrition';
import { formatLandingEnum, formatLandingPrice } from '@/shared/utils/plateNutrition';
import { AddIcon } from '@/shared/ui/PlateCard/components/CardIcons';
import { plateCardStyles } from '@/styles/modules/plateCard';

interface CompactCardProps {
  plate: LandingPlate;
  onAdd: (qty: number) => void;
  onNutrition?: (() => void) | undefined;
  onRecipe?: (() => void) | undefined;
  onReviews?: (() => void) | undefined;
  simpleMode?: boolean | undefined;
}

export const CompactCard = ({
  plate,
  onAdd,
  onNutrition,
  onRecipe,
  onReviews,
  simpleMode,
}: CompactCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasImage = Boolean(plate.imageUrl && !imageFailed);

  return (
    <article className={plateCardStyles.compactCard}>
      <div className={plateCardStyles.compactMedia}>
        {hasImage ? (
          <img
            src={plate.imageUrl!}
            alt=""
            className={plateCardStyles.compactMediaImage}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={plateCardStyles.compactMediaFallback} />
        )}
      </div>
      <div className={plateCardStyles.compactBody}>
        <p className={plateCardStyles.compactMeta}>{formatLandingEnum(plate.recipe.type)}</p>
        <h3 className={plateCardStyles.compactTitle}>{plate.name}</h3>

        <div className={plateCardStyles.compactRating}>
          <StarRatingDisplay value={plate.avgRating} size={14} showValue={false} />
          <span className={plateCardStyles.compactRatingValue}>{plate.avgRating.toFixed(1)}</span>
        </div>

        <p className={plateCardStyles.compactPrice}>{formatLandingPrice(plate.menuPrice)}</p>

        <div className={plateCardStyles.compactActions}>
          {!simpleMode && (
            <>
              <button
                type="button"
                className={plateCardStyles.iconButton}
                onClick={onNutrition}
                title="Nutrición"
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
            </>
          )}
          <button
            type="button"
            className={plateCardStyles.iconButton}
            onClick={onReviews}
            title="Reseñas"
          >
            <PlateDataIcon icon="review" width={16} height={16} />
          </button>
          <button
            type="button"
            className={plateCardStyles.addButton}
            onClick={handleAdd}
            disabled={!plate.isAvailable}
          >
            <AddIcon width={16} height={16} />
            <span>{added ? 'LISTO' : 'SUMAR'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
