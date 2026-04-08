/**
 * @file CustomerPage.tsx
 * @module Customer
 * @description Archivo CustomerPage alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: stores, hooks, params de ruta, modales y componentes del modulo
 * outputs: pantalla completa renderizada con sus flujos de interaccion
 * rules: coordinar estado de pagina sin duplicar logica de dominio
 *
 * @technical
 * dependencies: react, react-router-dom, appStore, sdk, CustomerFilters, CustomerPlateDetails, CustomerPlateList, customerPlate
 * flow: lee estado global y local de la pantalla; coordina formularios, fetches o modales; compone secciones reutilizables; renderiza la experiencia completa de la pagina.
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
 * decisions: la pagina orquesta estado y delega presentacion fina a componentes especializados
 */
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

  const selectedPlate =
    filteredPlates.find((plate) => plate.id === selectedPlateId) ?? filteredPlates[0] ?? null;

  const availablePlates = plates.filter((plate) => plate.isAvailable).length;
  const reviewedPlates = plates.filter((plate) => plate.reviews.length > 0).length;

  return (
    <main className="customer-page">
      <header className="customer-page__hero">
        <p>QART clientes</p>
        <h1>Explorador de platos</h1>
        <p>
          Vista funcional para clientes. No reutiliza la landing ni los builders anteriores, y queda
          lista para vestirla con otra identidad visual despues.
        </p>

        <nav aria-label="Accesos rapidos para clientes">
          <Link to="/">Ir a la landing</Link>
          <span> | </span>
          <Link to="/iam/login">Iniciar sesion</Link>
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
          <p>{reviewedPlates} platos con resenas</p>
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
          <p>Estamos trayendo los platos para la vista de clientes.</p>
        </section>
      )}

      {!isFetching && error && (
        <section className="customer-page__state">
          <h2>No se pudo cargar el catálogo</h2>
          <p>La vista de clientes quedo montada, pero la API no respondio correctamente.</p>
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
