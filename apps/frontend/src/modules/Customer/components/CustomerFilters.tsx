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
