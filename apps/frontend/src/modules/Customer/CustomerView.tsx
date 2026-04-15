/**
 * @file CustomerView.tsx
 * @module Customer
 * @description Vista principal del explorador de platos para clientes.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerFilters from '@/modules/Customer/components/CustomerFilters';
import CustomerPlateDetails from '@/modules/Customer/components/CustomerPlateDetails';
import CustomerPlateList from '@/modules/Customer/components/CustomerPlateList';
import { getCustomerPlateSearchText } from '@/modules/Customer/customerPlate';
import { useAppStore } from '@/shared/store/appStore';
import { sdk } from '@/shared/utils/sdk';
import { customerStyles } from '@/styles/modules/customer';

export const CustomerView = () => {
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

  const selectedPlate =
    filteredPlates.find((plate) => plate.id === selectedPlateId) ?? filteredPlates[0] ?? null;

  const availablePlates = plates.filter((plate) => plate.isAvailable).length;
  const reviewedPlates = plates.filter((plate) => plate.reviews.length > 0).length;

  return (
    <main className={customerStyles.page}>
      <div className={customerStyles.shell}>
        <header className={customerStyles.hero}>
          <div className={customerStyles.heroCopy}>
            <p className={customerStyles.heroKicker}>QART clientes</p>
            <h1 className={customerStyles.heroTitle}>Explorador de platos</h1>
            <p className={customerStyles.heroLead}>
              Esta vista consume el catálogo real desde `sdk.customers.plates`, filtra en memoria
              sin romper el contrato del SDK y mantiene toda la ficha del plato dentro del mismo
              flujo para el cliente.
            </p>

            <nav className={customerStyles.heroLinks} aria-label="Accesos rápidos para clientes">
              <span className={customerStyles.heroLinksLabel}>Navegación</span>
              <Link to="/" className={customerStyles.quickLink}>
                Ir a la landing
              </Link>
              <Link to="/iam/login" className={customerStyles.quickLink}>
                Iniciar sesión
              </Link>
            </nav>
          </div>

          <div className={customerStyles.heroStats}>
            <article className={customerStyles.summaryCard}>
              <span className={customerStyles.summaryLabel}>Catálogo</span>
              <strong className={customerStyles.summaryValue}>{plates.length}</strong>
              <p className={customerStyles.summaryText}>platos totales listos para explorar</p>
            </article>
            <article className={customerStyles.summaryCard}>
              <span className={customerStyles.summaryLabel}>Disponibles</span>
              <strong className={customerStyles.summaryValue}>{availablePlates}</strong>
              <p className={customerStyles.summaryText}>platos visibles hoy</p>
            </article>
            <article className={customerStyles.summaryCard}>
              <span className={customerStyles.summaryLabel}>Con reseñas</span>
              <strong className={customerStyles.summaryValue}>{reviewedPlates}</strong>
              <p className={customerStyles.summaryText}>platos con feedback público</p>
            </article>
          </div>
        </header>

        <CustomerFilters
          search={search}
          onlyAvailable={onlyAvailable}
          totalPlates={plates.length}
          visiblePlates={filteredPlates.length}
          onSearchChange={setSearch}
          onOnlyAvailableChange={setOnlyAvailable}
        />

        {isFetching ? (
          <section className={customerStyles.stateCard}>
            <h2 className={customerStyles.stateTitle}>Cargando catálogo</h2>
            <p className={customerStyles.stateCopy}>
              Estamos trayendo los platos para la vista de clientes.
            </p>
          </section>
        ) : null}

        {!isFetching && error ? (
          <section className={customerStyles.stateCard}>
            <h2 className={customerStyles.stateTitle}>No se pudo cargar el catálogo</h2>
            <p className={customerStyles.stateCopy}>
              La vista quedó montada, pero la API no respondió correctamente.
            </p>
          </section>
        ) : null}

        {!isFetching && !error ? (
          <section className={customerStyles.workspace}>
            <CustomerPlateList
              plates={filteredPlates}
              selectedPlateId={selectedPlate?.id ?? null}
              onSelect={(plateId) => setSelectedPlateId(plateId)}
            />
            <CustomerPlateDetails plate={selectedPlate} />
          </section>
        ) : null}
      </div>
    </main>
  );
};

export default CustomerView;
