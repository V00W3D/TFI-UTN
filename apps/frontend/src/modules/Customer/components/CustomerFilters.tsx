/**
 * @file CustomerFilters.tsx
 * @module Customer
 * @description Archivo CustomerFilters alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: sin imports directos; consumido por el modulo correspondiente
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
interface CustomerFiltersProps {
  search: string;
  onlyAvailable: boolean;
  totalPlates: number;
  visiblePlates: number;
  onSearchChange: (value: string) => void;
  onOnlyAvailableChange: (value: boolean) => void;
}
import { customerStyles } from '@/styles/modules/customer';

const CustomerFilters = ({
  search,
  onlyAvailable,
  totalPlates,
  visiblePlates,
  onSearchChange,
  onOnlyAvailableChange,
}: CustomerFiltersProps) => (
  <section className={customerStyles.filters}>
    <div className={customerStyles.filtersHeader}>
      <div>
        <h2 className={customerStyles.filtersTitle}>Explorar catálogo</h2>
        <p className={customerStyles.filtersSubtitle}>
          Filtrá por nombre y disponibilidad sin salir del contrato de `sdk.customers.plates`.
        </p>
      </div>
      <span className={customerStyles.filtersMeta}>
        {visiblePlates} visibles / {totalPlates} totales
      </span>
    </div>

    <div className={customerStyles.filtersGrid}>
      <label className={customerStyles.searchField}>
        <span className={customerStyles.fieldLabel}>Buscar plato</span>
        <input
          type="search"
          value={search}
          className={customerStyles.searchInput}
          placeholder="Ej: ensalada, pollo, vegano"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className={customerStyles.toggleRow}>
      <input
        type="checkbox"
        checked={onlyAvailable}
        className={customerStyles.toggleInput}
        onChange={(event) => onOnlyAvailableChange(event.target.checked)}
      />
        <span className={customerStyles.toggleLabel}>Mostrar solo platos disponibles</span>
      </label>
    </div>
  </section>
);

export default CustomerFilters;
