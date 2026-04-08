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
import { formatCustomerEnum, formatCustomerPrice, type CustomerPlate } from '../customerPlate';
import {
  PlateDataIcon,
  StarRatingDisplay,
  getIngredientIconKey,
  getPlateSizeIconKey,
  getPlateTypeIconKey,
} from '../../../components/shared/PlateDataIcons';
import CustomerDataPoint from './CustomerDataPoint';

const inlineIconStyle = {
  width: 18,
  height: 18,
  marginRight: 7,
  verticalAlign: 'text-bottom',
} as const;

interface CustomerPlateListProps {
  plates: CustomerPlate[];
  selectedPlateId: string | null;
  onSelect: (plateId: string) => void;
}

const CustomerPlateList = ({ plates, selectedPlateId, onSelect }: CustomerPlateListProps) => (
  <section className="customer-plate-list">
    <h2>Platos</h2>

    {plates.length === 0 ? (
      <p>No hay platos que coincidan con los filtros actuales.</p>
    ) : (
      <ul>
        {plates.map((plate) => (
          <li key={plate.id}>
            <button
              type="button"
              aria-pressed={selectedPlateId === plate.id}
              onClick={() => onSelect(plate.id)}
            >
              <strong>{plate.name}</strong>
              <div>
                <CustomerDataPoint icon="price" value={formatCustomerPrice(plate.menuPrice)} />
                <span> · </span>
                <CustomerDataPoint
                  icon={getPlateSizeIconKey(plate.size)}
                  value={formatCustomerEnum(plate.size)}
                />
                <span> · </span>
                <CustomerDataPoint
                  icon={getPlateTypeIconKey(plate.recipe.type)}
                  value={formatCustomerEnum(plate.recipe.type)}
                />
                <span> · </span>
                <CustomerDataPoint
                  icon="availability"
                  value={plate.isAvailable ? 'Disponible' : 'No disponible'}
                />
              </div>
              <div>
                <StarRatingDisplay
                  value={plate.avgRating}
                  reviewCount={plate.ratingsCount}
                  size={14}
                />
              </div>
              <p>{plate.description || 'Sin descripción breve.'}</p>
              <small>
                {plate.recipe.items.length > 0 ? (
                  <>
                    {plate.recipe.items.slice(0, 4).map((item, index) => (
                      <span key={item.id}>
                        <PlateDataIcon
                          icon={getIngredientIconKey(
                            item.variant.ingredient.name,
                            item.variant.ingredient.category,
                          )}
                          style={inlineIconStyle}
                        />
                        {item.variant.ingredient.name}
                        {index < Math.min(plate.recipe.items.length, 4) - 1 ? ' · ' : ''}
                      </span>
                    ))}
                    {plate.recipe.items.length > 4 ? ' · mas componentes' : ''}
                  </>
                ) : (
                  <CustomerDataPoint icon="ingredient" value="Sin ingredientes cargados" />
                )}
              </small>
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default CustomerPlateList;
