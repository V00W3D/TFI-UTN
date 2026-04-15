/**
 * @file CustomerPlateList.tsx
 * @module Customer
 * @description Archivo CustomerPlateList alineado a la arquitectura y trazabilidad QART.
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
import { formatCustomerEnum, formatCustomerPrice, type CustomerPlate } from '@/modules/Customer/customerPlate';
import {
  PlateDataIcon,
  StarRatingDisplay,
  getIngredientIconKey,
  getPlateSizeIconKey,
  getPlateTypeIconKey,
} from '@/shared/ui/PlateDataIcons';
import { customerListItemStyles, customerSectionStyles, customerStyles } from '@/styles/modules/customer';
import CustomerDataPoint from '@/modules/Customer/components/CustomerDataPoint';

interface CustomerPlateListProps {
  plates: CustomerPlate[];
  selectedPlateId: string | null;
  onSelect: (plateId: string) => void;
}

const CustomerPlateList = ({ plates, selectedPlateId, onSelect }: CustomerPlateListProps) => (
  <section className={customerSectionStyles({ tone: 'subtle' })}>
    <div className={customerStyles.sectionHeader}>
      <span className={customerStyles.sectionKicker}>Catálogo visible</span>
      <h2 className={customerStyles.sectionTitle}>Platos</h2>
      <p className={customerStyles.sectionCopy}>
        Seleccioná un plato para abrir su ficha completa con nutrición, componentes y reseñas.
      </p>
    </div>

    {plates.length === 0 ? (
      <p className={customerStyles.listEmpty}>No hay platos que coincidan con los filtros actuales.</p>
    ) : (
      <ul className={customerStyles.list}>
        {plates.map((plate) => (
          <li key={plate.id}>
            <button
              type="button"
              aria-pressed={selectedPlateId === plate.id}
              onClick={() => onSelect(plate.id)}
              className={customerListItemStyles({ active: selectedPlateId === plate.id })}
            >
              <div className={customerStyles.listButtonTop}>
                <strong className={customerStyles.listButtonTitle}>{plate.name}</strong>
                <span className={customerStyles.helperPill}>
                  {plate.isAvailable ? 'Disponible' : 'No disponible'}
                </span>
              </div>

              <div className={customerStyles.listButtonBody}>
                <div className={customerStyles.listMeta}>
                  <CustomerDataPoint icon="price" value={formatCustomerPrice(plate.menuPrice)} />
                  <span className={customerStyles.listMetaDivider}>·</span>
                  <CustomerDataPoint
                    icon={getPlateSizeIconKey(plate.size)}
                    value={formatCustomerEnum(plate.size)}
                  />
                  <span className={customerStyles.listMetaDivider}>·</span>
                  <CustomerDataPoint
                    icon={getPlateTypeIconKey(plate.recipe.type)}
                    value={formatCustomerEnum(plate.recipe.type)}
                  />
                  <span className={customerStyles.listMetaDivider}>·</span>
                  <CustomerDataPoint
                    icon="availability"
                    value={plate.isAvailable ? 'Disponible' : 'No disponible'}
                  />
                </div>

                <div className={customerStyles.listRating}>
                  <StarRatingDisplay
                    value={plate.avgRating}
                    reviewCount={plate.ratingsCount}
                    size={14}
                    className={customerStyles.starRating}
                  />
                </div>

                <p className={customerStyles.listDescription}>
                  {plate.description || 'Sin descripción breve.'}
                </p>

                {plate.recipe.items.length > 0 ? (
                  <div className={customerStyles.ingredientRow}>
                    {plate.recipe.items.slice(0, 4).map((item) => (
                      <span key={item.id} className={customerStyles.ingredientPill}>
                        <PlateDataIcon
                          icon={getIngredientIconKey(
                            item.variant.ingredient.name,
                            item.variant.ingredient.category,
                          )}
                          width={18}
                          height={18}
                          className={customerStyles.inlineIcon}
                        />
                        {item.variant.ingredient.name}
                      </span>
                    ))}
                    {plate.recipe.items.length > 4 ? (
                      <span className={customerStyles.helperPill}>Más componentes</span>
                    ) : null}
                  </div>
                ) : (
                  <p className={customerStyles.listEmpty}>
                    <CustomerDataPoint icon="ingredient" value="Sin ingredientes cargados" />
                  </p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default CustomerPlateList;

