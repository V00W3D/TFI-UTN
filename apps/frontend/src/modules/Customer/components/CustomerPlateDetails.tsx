/**
 * @file CustomerPlateDetails.tsx
 * @module Customer
 * @description Ficha detallada del plato para la vista de clientes.
 */
import {
  formatCustomerEnum,
  formatCustomerMetric,
  formatCustomerPrice,
  type CustomerPlate,
} from '@/modules/Customer/customerPlate';
import CustomerDataPoint from '@/modules/Customer/components/CustomerDataPoint';
import {
  PlateDataIcon,
  PlateDifficultyIcon,
  StarRatingDisplay,
  getIngredientIconKey,
  getPlateSizeIconKey,
  getPlateTypeIconKey,
  type PlateDataIconKey,
} from '@/shared/ui/PlateDataIcons';
import { customerSectionStyles, customerStyles } from '@/styles/modules/customer';

interface CustomerPlateDetailsProps {
  plate: CustomerPlate | null;
}

const renderItems = (items: string[], icon: PlateDataIconKey, emptyLabel: string) =>
  items.length > 0 ? (
    <ul className={customerStyles.taggedList}>
      {items.map((item) => (
        <li key={item}>
          <CustomerDataPoint icon={icon} value={item} />
        </li>
      ))}
    </ul>
  ) : (
    <p className={customerStyles.bodyText}>{emptyLabel}</p>
  );

export const CustomerPlateDetails = ({ plate }: CustomerPlateDetailsProps) => {
  if (!plate) {
    return (
      <section className={customerSectionStyles()}>
        <div className={customerStyles.sectionHeader}>
          <span className={customerStyles.sectionKicker}>Ficha</span>
          <h2 className={customerStyles.sectionTitle}>Detalle</h2>
          <p className={customerStyles.sectionCopy}>
            Elegí un plato del listado para ver su composición, su nutrición y las reseñas
            disponibles.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={customerSectionStyles()}>
      <header className={customerStyles.detailsHeader}>
        <p className={customerStyles.detailsEyebrow}>Ficha de cliente</p>
        <h2 className={customerStyles.detailsTitle}>{plate.name}</h2>
        <p className={customerStyles.detailsLead}>
          {plate.description || 'Sin descripción extendida para este plato.'}
        </p>
      </header>

      <div className={customerStyles.detailsStack}>
        <section className={customerStyles.detailsSection}>
          <h3 className={customerStyles.detailsSectionTitle}>
            <PlateDataIcon icon="recipe" width={20} height={20} className={customerStyles.sectionIcon} />
            Resumen rápido
          </h3>
          <ul className={customerStyles.dataList}>
            <li>
              <CustomerDataPoint
                icon="price"
                label="Precio final"
                value={formatCustomerPrice(plate.menuPrice)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon={getPlateSizeIconKey(plate.size)}
                label="Tamaño"
                value={formatCustomerEnum(plate.size)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon={getPlateTypeIconKey(plate.recipe.type)}
                label="Tipo"
                value={formatCustomerEnum(plate.recipe.type)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="recipe"
                label="Sabor"
                value={formatCustomerEnum(plate.recipe.flavor)}
              />
            </li>
            <li>
              <CustomerDataPoint
                iconNode={
                  <PlateDifficultyIcon
                    difficulty={plate.recipe.difficulty}
                    width={64}
                    height={20}
                    className={customerStyles.difficultyInline}
                  />
                }
                label="Dificultad"
                value={formatCustomerEnum(plate.recipe.difficulty)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="availability"
                label="Disponibilidad"
                value={plate.isAvailable ? 'Disponible' : 'No disponible'}
              />
            </li>
            <li>
              <CustomerDataPoint
                iconNode={
                  <StarRatingDisplay
                    value={plate.avgRating}
                    size={14}
                    showValue={false}
                    className={customerStyles.starRating}
                  />
                }
                label="Valoración"
                value={`${plate.avgRating.toFixed(1)} / 5`}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="weight"
                label="Peso servido"
                value={formatCustomerMetric(plate.servedWeightGrams, 'g', 0)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="time"
                label="Prep"
                value={formatCustomerMetric(plate.recipe.prepTimeMinutes, 'min', 0)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="time"
                label="Cocción"
                value={formatCustomerMetric(plate.recipe.cookTimeMinutes, 'min', 0)}
              />
            </li>
          </ul>
        </section>

        <section className={customerStyles.detailsSection}>
          <h3 className={customerStyles.detailsSectionTitle}>
            <PlateDataIcon
              icon="nutritionTag"
              width={20}
              height={20}
              className={customerStyles.sectionIcon}
            />
            Nutrición
          </h3>
          <ul className={customerStyles.dataList}>
            <li>
              <CustomerDataPoint
                icon="calories"
                label="Calorías"
                value={formatCustomerMetric(plate.nutrition.calories, 'kcal', 0)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="protein"
                label="Proteínas"
                value={formatCustomerMetric(plate.nutrition.proteins, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="carbs"
                label="Carbohidratos"
                value={formatCustomerMetric(plate.nutrition.carbs, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="fat"
                label="Grasas"
                value={formatCustomerMetric(plate.nutrition.fats, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="fatSaturated"
                label="Grasas saturadas"
                value={formatCustomerMetric(plate.nutrition.saturatedFat, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="fatTrans"
                label="Grasas trans"
                value={formatCustomerMetric(plate.nutrition.transFat, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="fatMonounsaturated"
                label="Grasas mono"
                value={formatCustomerMetric(plate.nutrition.monounsaturatedFat, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="fatPolyunsaturated"
                label="Grasas poli"
                value={formatCustomerMetric(plate.nutrition.polyunsaturatedFat, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="fiber"
                label="Fibra"
                value={formatCustomerMetric(plate.nutrition.fiber, 'g', 1)}
              />
            </li>
            <li>
              <CustomerDataPoint
                icon="sodium"
                label="Sodio"
                value={formatCustomerMetric(plate.nutrition.sodium, 'mg', 0)}
              />
            </li>
          </ul>
          <p className={customerStyles.bodyText}>
            {plate.nutritionNotes || 'Sin nota nutricional adicional.'}
          </p>
        </section>

        <section className={customerStyles.detailsSection}>
          <h3 className={customerStyles.detailsSectionTitle}>
            <PlateDataIcon
              icon="ingredient"
              width={20}
              height={20}
              className={customerStyles.sectionIcon}
            />
            Etiquetas
          </h3>

          <div className={customerStyles.taggedList}>
            <div>
              <h4 className={customerStyles.detailsSubTitle}>
                <PlateDataIcon
                  icon="dietaryTag"
                  width={18}
                  height={18}
                  className={customerStyles.sectionIcon}
                />
                Dietarias
              </h4>
              {renderItems(
                plate.dietaryTags.map((tag) => formatCustomerEnum(tag)),
                'dietaryTag',
                'Sin etiquetas dietarias.',
              )}
            </div>

            <div>
              <h4 className={customerStyles.detailsSubTitle}>
                <PlateDataIcon
                  icon="nutritionTag"
                  width={18}
                  height={18}
                  className={customerStyles.sectionIcon}
                />
                Nutricionales
              </h4>
              {renderItems(
                plate.nutritionTags.map((tag) => formatCustomerEnum(tag)),
                'nutritionTag',
                'Sin etiquetas nutricionales.',
              )}
            </div>

            <div>
              <h4 className={customerStyles.detailsSubTitle}>
                <PlateDataIcon
                  icon="allergen"
                  width={18}
                  height={18}
                  className={customerStyles.sectionIcon}
                />
                Alérgenos
              </h4>
              {renderItems(
                plate.allergens.map((allergen) => formatCustomerEnum(allergen)),
                'allergen',
                'Sin alérgenos declarados.',
              )}
            </div>
          </div>
        </section>

        <section className={customerStyles.detailsSection}>
          <h3 className={customerStyles.detailsSectionTitle}>
            <PlateDataIcon
              icon="preparation"
              width={20}
              height={20}
              className={customerStyles.sectionIcon}
            />
            Receta y componentes
          </h3>
          <p className={customerStyles.bodyText}>
            <CustomerDataPoint icon="recipe" label="Receta base" value={plate.recipe.name} />
          </p>
          <p className={customerStyles.bodyText}>
            {plate.recipe.description || 'Sin descripción para la receta base.'}
          </p>
          <p className={customerStyles.bodyText}>
            <CustomerDataPoint
              icon="preparation"
              label="Armado"
              value={plate.recipe.assemblyNotes || 'Sin notas de armado.'}
            />
          </p>

          <ol className={customerStyles.orderedList}>
            {plate.recipe.items.map((item) => {
              const ingredientIcon = getIngredientIconKey(
                item.variant.ingredient.name,
                item.variant.ingredient.category,
              );

              return (
                <li key={item.id} className={customerStyles.orderedItem}>
                  <div className={customerStyles.orderedHead}>
                    <PlateDataIcon
                      icon={ingredientIcon}
                      width={20}
                      height={20}
                      className={customerStyles.sectionIcon}
                    />
                    <strong>{item.variant.name}</strong>
                  </div>

                  <div className={customerStyles.taggedList}>
                    <CustomerDataPoint
                      icon={ingredientIcon}
                      label="Ingrediente"
                      value={`${item.variant.ingredient.name} · ${formatCustomerMetric(item.quantityGrams, 'g', 0)}`}
                    />
                    <CustomerDataPoint
                      icon="preparation"
                      label={formatCustomerEnum(item.variant.preparationMethod)}
                      value={item.prepNotes || item.variant.preparationNotes || 'Sin notas adicionales.'}
                    />
                    {item.isMainComponent ? (
                      <CustomerDataPoint icon="ingredient" label="Rol" value="Componente principal" />
                    ) : null}
                    {item.isOptional ? (
                      <CustomerDataPoint icon="ingredient" label="Rol" value="Componente opcional" />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {plate.adjustments.length > 0 ? (
          <section className={customerStyles.detailsSection}>
            <h3 className={customerStyles.detailsSectionTitle}>
              <PlateDataIcon
                icon="ingredient"
                width={20}
                height={20}
                className={customerStyles.sectionIcon}
              />
              Ajustes del plato
            </h3>
            <ul className={customerStyles.taggedList}>
              {plate.adjustments.map((adjustment) => {
                const adjustmentIngredient =
                  adjustment.variant?.ingredient ?? adjustment.recipeItem?.variant.ingredient ?? null;
                const adjustmentIcon = adjustmentIngredient
                  ? getIngredientIconKey(adjustmentIngredient.name, adjustmentIngredient.category)
                  : 'ingredient';

                return (
                  <li key={adjustment.id}>
                    <CustomerDataPoint
                      icon={adjustmentIcon}
                      label={formatCustomerEnum(adjustment.adjustmentType)}
                      value={`${adjustment.variant?.name || adjustment.recipeItem?.variant.name || 'Ajuste sin variante'} · ${formatCustomerMetric(adjustment.quantityGrams, 'g', 0)}`}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section className={customerStyles.detailsSection}>
          <h3 className={customerStyles.detailsSectionTitle}>
            <PlateDataIcon icon="review" width={20} height={20} className={customerStyles.sectionIcon} />
            Reseñas
          </h3>
          {plate.reviews.length > 0 ? (
            <ul className={customerStyles.reviewList}>
              {plate.reviews.map((review) => (
                <li key={review.id} className={customerStyles.reviewItem}>
                  <CustomerDataPoint icon="info" label="Cliente" value={review.reviewer.displayName} />
                  <CustomerDataPoint
                    iconNode={
                      <StarRatingDisplay
                        value={review.rating}
                        size={14}
                        showValue={false}
                        className={customerStyles.starRating}
                      />
                    }
                    label="Puntaje"
                    value={formatCustomerMetric(review.rating, '/ 5', 1)}
                  />
                  <p className={customerStyles.reviewText}>
                    <CustomerDataPoint
                      icon="review"
                      label="Comentario"
                      value={review.comment || 'Sin comentario.'}
                    />
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={customerStyles.bodyText}>Este plato todavía no tiene reseñas públicas.</p>
          )}
        </section>
      </div>
    </section>
  );
};

export default CustomerPlateDetails;
