/**
 * @file CustomerPlateDetails.tsx
 * @module Customer
 * @description Archivo CustomerPlateDetails alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: customerPlate, PlateDataIcons, CustomerDataPoint
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
import {
  formatCustomerEnum,
  formatCustomerMetric,
  formatCustomerPrice,
  type CustomerPlate,
} from '../customerPlate';
import {
  PlateDataIcon,
  PlateDifficultyIcon,
  StarRatingDisplay,
  getIngredientIconKey,
  getPlateSizeIconKey,
  getPlateTypeIconKey,
  type PlateDataIconKey,
} from '../../../components/shared/PlateDataIcons';
import CustomerDataPoint from './CustomerDataPoint';

const inlineIconStyle = {
  width: 20,
  height: 20,
  marginRight: 7,
  verticalAlign: 'text-bottom',
} as const;

interface CustomerPlateDetailsProps {
  plate: CustomerPlate | null;
}

const renderItems = (items: string[], icon: PlateDataIconKey, emptyLabel: string) =>
  items.length > 0 ? (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <CustomerDataPoint icon={icon} value={item} />
        </li>
      ))}
    </ul>
  ) : (
    <p>{emptyLabel}</p>
  );

const CustomerPlateDetails = ({ plate }: CustomerPlateDetailsProps) => {
  if (!plate) {
    return (
      <section className="customer-plate-details">
        <h2>Detalle</h2>
        <p>Elegí un plato del listado para ver su ficha.</p>
      </section>
    );
  }

  return (
    <section className="customer-plate-details">
      <header>
        <p>Ficha de cliente</p>
        <h2>{plate.name}</h2>
        <p>{plate.description || 'Sin descripción extendida para este plato.'}</p>
      </header>

      <section>
        <h3>
          <PlateDataIcon icon="recipe" style={inlineIconStyle} />
          Resumen rapido
        </h3>
        <ul>
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
              label="Tamano"
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
                  style={{ width: 64, height: 20, marginRight: 7, verticalAlign: 'text-bottom' }}
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
                  className="customer-star-rating"
                />
              }
              label="Valoracion"
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
              label="Coccion"
              value={formatCustomerMetric(plate.recipe.cookTimeMinutes, 'min', 0)}
            />
          </li>
        </ul>
      </section>

      <section>
        <h3>
          <PlateDataIcon icon="nutritionTag" style={inlineIconStyle} />
          Nutricion
        </h3>
        <ul>
          <li>
            <CustomerDataPoint
              icon="calories"
              label="Calorias"
              value={formatCustomerMetric(plate.nutrition.calories, 'kcal', 0)}
            />
          </li>
          <li>
            <CustomerDataPoint
              icon="protein"
              label="Proteinas"
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
        <p>{plate.nutritionNotes || 'Sin nota nutricional adicional.'}</p>
      </section>

      <section>
        <h3>
          <PlateDataIcon icon="ingredient" style={inlineIconStyle} />
          Etiquetas
        </h3>
        <h4>
          <PlateDataIcon icon="dietaryTag" style={inlineIconStyle} />
          Dietarias
        </h4>
        {renderItems(
          plate.dietaryTags.map((tag) => formatCustomerEnum(tag)),
          'dietaryTag',
          'Sin etiquetas dietarias.',
        )}
        <h4>
          <PlateDataIcon icon="nutritionTag" style={inlineIconStyle} />
          Nutricionales
        </h4>
        {renderItems(
          plate.nutritionTags.map((tag) => formatCustomerEnum(tag)),
          'nutritionTag',
          'Sin etiquetas nutricionales.',
        )}
        <h4>
          <PlateDataIcon icon="allergen" style={inlineIconStyle} />
          Alergenos
        </h4>
        {renderItems(
          plate.allergens.map((allergen) => formatCustomerEnum(allergen)),
          'allergen',
          'Sin alérgenos declarados.',
        )}
      </section>

      <section>
        <h3>
          <PlateDataIcon icon="preparation" style={inlineIconStyle} />
          Receta y componentes
        </h3>
        <p>
          <CustomerDataPoint icon="recipe" label="Receta base" value={plate.recipe.name} />
        </p>
        <p>{plate.recipe.description || 'Sin descripcion para la receta base.'}</p>
        <p>
          <CustomerDataPoint
            icon="preparation"
            label="Armado"
            value={plate.recipe.assemblyNotes || 'Sin notas de armado.'}
          />
        </p>
        <ol>
          {plate.recipe.items.map((item) => (
            <li key={item.id}>
              <div>
                <PlateDataIcon
                  icon={getIngredientIconKey(
                    item.variant.ingredient.name,
                    item.variant.ingredient.category,
                  )}
                  style={inlineIconStyle}
                />
                <strong>{item.variant.name}</strong>
              </div>
              <div>
                <CustomerDataPoint
                  icon={getIngredientIconKey(
                    item.variant.ingredient.name,
                    item.variant.ingredient.category,
                  )}
                  label="Ingrediente"
                  value={`${item.variant.ingredient.name} · ${formatCustomerMetric(item.quantityGrams, 'g', 0)}`}
                />
              </div>
              <p>
                <CustomerDataPoint
                  icon="preparation"
                  label={formatCustomerEnum(item.variant.preparationMethod)}
                  value={
                    item.prepNotes || item.variant.preparationNotes || 'Sin notas adicionales.'
                  }
                />
              </p>
              {item.isMainComponent && (
                <p>
                  <CustomerDataPoint icon="ingredient" label="Rol" value="Componente principal" />
                </p>
              )}
              {item.isOptional && (
                <p>
                  <CustomerDataPoint icon="ingredient" label="Rol" value="Componente opcional" />
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {plate.adjustments.length > 0 && (
        <section>
          <h3>
            <PlateDataIcon icon="ingredient" style={inlineIconStyle} />
            Ajustes del plato
          </h3>
          <ul>
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
      )}

      <section>
        <h3>
          <PlateDataIcon icon="review" style={inlineIconStyle} />
          Resenas
        </h3>
        {plate.reviews.length > 0 ? (
          <ul>
            {plate.reviews.map((review) => (
              <li key={review.id}>
                <p>
                  <CustomerDataPoint
                    icon="info"
                    label="Cliente"
                    value={review.reviewer.displayName}
                  />
                </p>
                <p>
                  <CustomerDataPoint
                    iconNode={
                      <StarRatingDisplay value={review.rating} size={14} showValue={false} />
                    }
                    label="Puntaje"
                    value={formatCustomerMetric(review.rating, '/ 5', 1)}
                  />
                </p>
                <p>
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
          <p>Este plato todavía no tiene reseñas públicas.</p>
        )}
      </section>
    </section>
  );
};

export default CustomerPlateDetails;
