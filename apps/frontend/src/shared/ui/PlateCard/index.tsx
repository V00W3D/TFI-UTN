/**
 * @file index.tsx
 * @module PlateCard
 * @description Componente unificado para la visualización de platos con soporte de variantes.
 */
import { useAppStore } from '@/shared/store/appStore';
import { useOrderStore } from '@/shared/store/orderStore';
import type { LandingPlate } from '@/shared/utils/plateNutrition';
import { CompactCard } from '@/shared/ui/PlateCard/components/CompactCard';
import { FeaturedCard } from '@/shared/ui/PlateCard/components/FeaturedCard';

interface PlateCardProps {
  plate: LandingPlate;
  variant: 'featured' | 'compact';
  onNutrition?: () => void;
  onRecipe?: () => void;
  onReviews?: () => void;
}

export const PlateCard = ({ plate, variant, onNutrition, onRecipe, onReviews }: PlateCardProps) => {
  const { addItem, setOpen } = useOrderStore();
  const { simpleMode } = useAppStore();

  const handleAdd = (qty: number) => {
    addItem(plate, qty);
    setOpen(true);
  };

  if (variant === 'compact') {
    return (
      <CompactCard
        plate={plate}
        onAdd={handleAdd}
        onNutrition={onNutrition}
        onRecipe={onRecipe}
        onReviews={onReviews}
        simpleMode={simpleMode}
      />
    );
  }

  return (
    <FeaturedCard plate={plate} onAdd={handleAdd} onNutrition={onNutrition} onRecipe={onRecipe} />
  );
};

export default PlateCard;
