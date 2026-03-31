import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { sdk } from '../../../tools/sdk';
import CustomerFilters from '../components/CustomerFilters';
import CustomerPlateDetails from '../components/CustomerPlateDetails';
import CustomerPlateList from '../components/CustomerPlateList';
import { getCustomerPlateSearchText } from '../customerPlate';

const CustomerPage = () => {
  const { setModule } = useAppStore();
  const { data, isFetching, error } = sdk.customers.plates.$use();
  const [search, setSearch] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [selectedPlateId, setSelectedPlateId] = useState<string | null>(null);

  useEffect(() => {
    setModule('CUSTOMER');
  }, [setModule]);

  useEffect(() => {
    void sdk.customers.plates({});
  }, []);

  const plates = data && 'data' in data ? data.data : [];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPlates = plates.filter((plate) => {
    const matchesAvailability = onlyAvailable ? plate.isAvailable : true;
    const matchesSearch =
      normalizedSearch.length === 0 || getCustomerPlateSearchText(plate).includes(normalizedSearch);

    return matchesAvailability && matchesSearch;
  });

  useEffect(() => {
    if (filteredPlates.length === 0) {
      if (selectedPlateId !== null) {
        setSelectedPlateId(null);
      }

      return;
    }

    const selectionStillVisible = filteredPlates.some((plate) => plate.id === selectedPlateId);

    if (!selectionStillVisible) {
      setSelectedPlateId(filteredPlates[0].id);
    }
  }, [filteredPlates, selectedPlateId]);

  const selectedPlate =
    filteredPlates.find((plate) => plate.id === selectedPlateId) ??
    filteredPlates[0] ??
    null;

  const availablePlates = plates.filter((plate) => plate.isAvailable).length;
  const reviewedPlates = plates.filter((plate) => plate.reviews.length > 0).length;

  return (
    <main className="customer-page">
      <header className="customer-page__hero">
        <p>QART customer</p>
        <h1>Explorador de platos</h1>
        <p>
          Boceto funcional para la experiencia customer. No reutiliza la landing ni los builders
          anteriores, y queda listo para vestirlo con otra identidad visual después.
        </p>

        <nav aria-label="Accesos rápidos customer">
          <Link to="/">Ir a la landing</Link>
          <span> | </span>
          <Link to="/iam/login">Iniciar sesión</Link>
        </nav>
      </header>

      <section className="customer-page__summary" aria-label="Resumen del catálogo">
        <article>
          <h2>Catálogo</h2>
          <p>{plates.length} platos totales</p>
        </article>
        <article>
          <h2>Disponibles</h2>
          <p>{availablePlates} platos visibles hoy</p>
        </article>
        <article>
          <h2>Con reseñas</h2>
          <p>{reviewedPlates} platos con feedback</p>
        </article>
      </section>

      <CustomerFilters
        search={search}
        onlyAvailable={onlyAvailable}
        totalPlates={plates.length}
        visiblePlates={filteredPlates.length}
        onSearchChange={setSearch}
        onOnlyAvailableChange={setOnlyAvailable}
      />

      {isFetching && (
        <section className="customer-page__state">
          <h2>Cargando catálogo</h2>
          <p>Estamos trayendo los platos para la vista customer.</p>
        </section>
      )}

      {!isFetching && error && (
        <section className="customer-page__state">
          <h2>No se pudo cargar el catálogo</h2>
          <p>La vista customer quedó montada, pero la API no respondió correctamente.</p>
        </section>
      )}

      {!isFetching && !error && (
        <section className="customer-page__workspace">
          <CustomerPlateList
            plates={filteredPlates}
            selectedPlateId={selectedPlate?.id ?? null}
            onSelect={(plateId) => setSelectedPlateId(plateId)}
          />
          <CustomerPlateDetails plate={selectedPlate} />
        </section>
      )}
    </main>
  );
};

export default CustomerPage;
