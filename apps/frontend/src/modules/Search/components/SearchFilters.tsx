/**
 * @file SearchFilters.tsx
 * @module Search
 * @description Archivo SearchFilters alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: react, @app/contracts, @app/sdk, landingPlateNutrition, searchUrl
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
import type { ReactNode } from 'react';
import type { SearchPlatesQuery } from '@app/contracts';
import {
  ALLERGEN_VALUES,
  DIETARY_TAG_VALUES,
  DIFFICULTY_VALUES,
  FLAVOR_PROFILE_VALUES,
  NUTRITION_TAG_VALUES,
  PLATE_SIZE_VALUES,
  PLATE_TYPE_VALUES,
} from '@app/sdk';
import { formatLandingEnum } from '../../Landing/components/landingPlateNutrition';
import { mergeSearchPayload, stringifySearchUrl } from '../searchUrl';

type Props = {
  searchParams: URLSearchParams;
  onReplaceParams: (next: URLSearchParams) => void;
};

const toggleArray = <T extends string>(list: T[] | undefined, value: T): T[] | undefined => {
  const cur = list ?? [];
  const has = cur.includes(value);
  const next = has ? cur.filter((x) => x !== value) : [...cur, value];
  return next.length ? next : undefined;
};

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <div className="search-filter-section" id={id}>
    <h3 className="search-filter-section__title">
      <span className="search-filter-section__marker" aria-hidden />
      {title}
    </h3>
    <div className="search-filter-section__body">{children}</div>
  </div>
);

const chipLabel = (v: string) => formatLandingEnum(v);

export const SearchFilters = ({ searchParams, onReplaceParams }: Props) => {
  const state = mergeSearchPayload(searchParams);

  const patch = (partial: Partial<SearchPlatesQuery>) => {
    const nextState: SearchPlatesQuery = { ...state, ...partial };
    if (!('page' in partial)) nextState.page = 1;
    onReplaceParams(new URLSearchParams(stringifySearchUrl(nextState)));
  };

  const clearAll = () => {
    onReplaceParams(new URLSearchParams());
  };

  const numField = (
    label: string,
    key: keyof SearchPlatesQuery,
    opts?: { min?: number; step?: number },
  ) => (
    <label className="search-filter-field">
      <span className="search-filter-field__label">{label}</span>
      <input
        type="number"
        className="search-filter-input"
        min={opts?.min}
        step={opts?.step}
        value={typeof state[key] === 'number' ? state[key] : ''}
        onChange={(e) => {
          const raw = e.target.value;
          patch({ [key]: raw === '' ? undefined : Number(raw) } as Partial<SearchPlatesQuery>);
        }}
      />
    </label>
  );

  return (
    <div className="search-filters">
      <p className="search-filters__strap">Refiná tu búsqueda</p>
      <div className="search-filters__head">
        <h2 className="search-filters__h">Filtros</h2>
        <button type="button" className="search-filters__clear" onClick={clearAll}>
          Limpiar
        </button>
      </div>

      <Section id="filtros-orden" title="Orden">
        <label className="search-filter-field">
          <span className="search-filter-field__label">Ordenar</span>
          <div className="custom-select-container">
            <select
              className="custom-select"
              value={state.sort}
              onChange={(e) =>
                patch({ sort: e.target.value as SearchPlatesQuery['sort'], page: 1 })
              }
            >
              <option value="name_asc">Nombre A–Z</option>
              <option value="name_desc">Nombre Z–A</option>
              <option value="price_asc">Precio ↑</option>
              <option value="price_desc">Precio ↓</option>
              <option value="rating_desc">Mejor puntaje</option>
              <option value="rating_asc">Menor puntaje</option>
              <option value="popular_desc">Más pedidos</option>
            </select>
          </div>
        </label>
      </Section>

      <Section id="filtros-precio" title="Precio (menú)">
        <div className="search-filter-row">
          {numField('Mín.', 'minPrice', { min: 0 })}
          {numField('Máx.', 'maxPrice', { min: 0 })}
        </div>
      </Section>

      <Section id="filtros-tipo" title="Tipo de plato">
        <div className="search-filter-list">
          {PLATE_TYPE_VALUES.map((v) => (
            <label key={v} className="custom-checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={state.recipeTypes?.includes(v) ?? false}
                onChange={() => patch({ recipeTypes: toggleArray(state.recipeTypes, v), page: 1 })}
              />
              <div className="custom-checkbox-box" />
              <span className="custom-checkbox-label">{chipLabel(v)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="filtros-tamano" title="Tamaño">
        <div className="search-filter-list">
          {PLATE_SIZE_VALUES.map((v) => (
            <label key={v} className="custom-checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={state.sizes?.includes(v) ?? false}
                onChange={() => patch({ sizes: toggleArray(state.sizes, v), page: 1 })}
              />
              <div className="custom-checkbox-box" />
              <span className="custom-checkbox-label">{chipLabel(v)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="filtros-sabor" title="Sabor / receta">
        <div className="search-filter-list">
          {FLAVOR_PROFILE_VALUES.map((v) => (
            <label key={v} className="custom-checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={state.flavors?.includes(v) ?? false}
                onChange={() => patch({ flavors: toggleArray(state.flavors, v), page: 1 })}
              />
              <div className="custom-checkbox-box" />
              <span className="custom-checkbox-label">{chipLabel(v)}</span>
            </label>
          ))}
        </div>
        <label className="search-filter-field">
          <span className="search-filter-field__label">Dificultad</span>
          <div className="search-filter-list mt-2">
            {DIFFICULTY_VALUES.map((v) => (
              <label key={v} className="custom-checkbox-container">
                <input
                  type="checkbox"
                  className="custom-checkbox-input"
                  checked={state.difficulties?.includes(v) ?? false}
                  onChange={() =>
                    patch({ difficulties: toggleArray(state.difficulties, v), page: 1 })
                  }
                />
                <div className="custom-checkbox-box" />
                <span className="custom-checkbox-label">{chipLabel(v)}</span>
              </label>
            ))}
          </div>
        </label>
      </Section>

      <Section id="filtros-nutricion" title="Nutrición declarada (plato)">
        <div className="search-filter-row">
          {numField('Cal mín', 'minCalories', { min: 0 })}
          {numField('Cal máx', 'maxCalories', { min: 0 })}
        </div>
        <div className="search-filter-row">
          {numField('Prot. mín g', 'minProtein', { min: 0, step: 0.1 })}
          {numField('Prot. máx g', 'maxProtein', { min: 0, step: 0.1 })}
        </div>
        <div className="search-filter-row">
          {numField('Grasa mín g', 'minFat', { min: 0, step: 0.1 })}
          {numField('Grasa máx g', 'maxFat', { min: 0, step: 0.1 })}
        </div>
        <div className="search-filter-row">
          {numField('Peso servido mín g', 'minServedWeightGrams', { min: 0 })}
          {numField('Peso servido máx g', 'maxServedWeightGrams', { min: 0 })}
        </div>
      </Section>

      <Section id="filtros-resenas" title="Reseñas e interaccion">
        {numField('Rating mín.', 'minRating', { min: 0, step: 0.1 })}
        {numField('Cant. reseñas mín.', 'minRatingsCount', { min: 0, step: 1 })}
        {numField('Likes mín.', 'minLikes', { min: 0, step: 1 })}
      </Section>

      <Section id="filtros-tiempos" title="Tiempos receta">
        {numField('Prep máx (min)', 'maxPrepMinutes', { min: 0, step: 1 })}
        {numField('Cocción máx (min)', 'maxCookMinutes', { min: 0, step: 1 })}
        <div className="search-filter-row">
          {numField('Porciones mín.', 'minYieldServings', { min: 1, step: 1 })}
          {numField('Porciones máx.', 'maxYieldServings', { min: 1, step: 1 })}
        </div>
      </Section>

      <Section id="filtros-alergenos" title="Sin alérgenos">
        <div className="search-filter-list">
          {ALLERGEN_VALUES.map((v) => (
            <label key={v} className="custom-checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={state.excludeAllergens?.includes(v) ?? false}
                onChange={() =>
                  patch({ excludeAllergens: toggleArray(state.excludeAllergens, v), page: 1 })
                }
              />
              <div className="custom-checkbox-box" />
              <span className="custom-checkbox-label">{chipLabel(v)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="filtros-dieta" title="Etiquetas dieta (plato)">
        <div className="search-filter-list">
          {DIETARY_TAG_VALUES.map((v) => (
            <label key={v} className="custom-checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={state.dietaryTags?.includes(v) ?? false}
                onChange={() => patch({ dietaryTags: toggleArray(state.dietaryTags, v), page: 1 })}
              />
              <div className="custom-checkbox-box" />
              <span className="custom-checkbox-label">{chipLabel(v)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="filtros-nutri-tags" title="Destacados nutricionales">
        <div className="search-filter-list">
          {NUTRITION_TAG_VALUES.map((v) => (
            <label key={v} className="custom-checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={state.nutritionTags?.includes(v) ?? false}
                onChange={() =>
                  patch({ nutritionTags: toggleArray(state.nutritionTags, v), page: 1 })
                }
              />
              <div className="custom-checkbox-box" />
              <span className="custom-checkbox-label">{chipLabel(v)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="filtros-receta-dieta" title="Dieta a nivel receta">
        <div className="search-filter-list">
          {DIETARY_TAG_VALUES.map((v) => (
            <label key={v} className="custom-checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={state.recipeDietaryTags?.includes(v) ?? false}
                onChange={() =>
                  patch({ recipeDietaryTags: toggleArray(state.recipeDietaryTags, v), page: 1 })
                }
              />
              <div className="custom-checkbox-box" />
              <span className="custom-checkbox-label">{chipLabel(v)}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="filtros-tags-cartel" title="Etiquetas de carta (nombre)">
        <label className="search-filter-field">
          <span className="search-filter-field__label">Separados por coma</span>
          <input
            type="text"
            className="search-filter-input"
            placeholder="ej. favorito, picante"
            value={(state.tagNames ?? []).join(', ')}
            onChange={(e) => {
              const parts = e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
              patch({ tagNames: parts.length ? parts : undefined, page: 1 });
            }}
          />
        </label>
      </Section>
    </div>
  );
};
