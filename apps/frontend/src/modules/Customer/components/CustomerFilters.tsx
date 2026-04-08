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

const CustomerFilters = ({
  search,
  onlyAvailable,
  totalPlates,
  visiblePlates,
  onSearchChange,
  onOnlyAvailableChange,
}: CustomerFiltersProps) => (
  <section className="customer-filters">
    <h2>Explorar catálogo</h2>

    <label>
      Buscar plato
      <input
        type="search"
        value={search}
        placeholder="Ej: ensalada, pollo, vegano"
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </label>

    <label>
      <input
        type="checkbox"
        checked={onlyAvailable}
        onChange={(event) => onOnlyAvailableChange(event.target.checked)}
      />
      Mostrar solo platos disponibles
    </label>

    <p>
      Viendo {visiblePlates} de {totalPlates} platos.
    </p>
  </section>
);

export default CustomerFilters;
