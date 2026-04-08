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
