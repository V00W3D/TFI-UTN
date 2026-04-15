/**
 * @file index.tsx
 * @module Search
 * @description Componente de filtrado avanzado para la búsqueda de platos.
 */
import {
  ALLERGEN_VALUES,
  DIETARY_TAG_VALUES,
  DIFFICULTY_VALUES,
  FLAVOR_PROFILE_VALUES,
  NUTRITION_TAG_VALUES,
  PLATE_SIZE_VALUES,
  PLATE_TYPE_VALUES,
} from '@app/sdk';
import type { SearchPlatesQuery } from '@app/contracts';
import { Section, chipLabel, toggleArray } from '@/modules/Search/SearchView/SearchFilters/components/FilterShared';
import { mergeSearchPayload, stringifySearchUrl } from '@/modules/Search/searchUrl';
import { searchStyles } from '@/styles/modules/search';

type Props = {
  searchParams: URLSearchParams;
  onReplaceParams: (next: URLSearchParams) => void;
};

export const SearchFilters = ({ searchParams, onReplaceParams }: Props) => {
  const state = mergeSearchPayload(searchParams);

  const patch = (partial: Partial<SearchPlatesQuery>) => {
    const nextState: SearchPlatesQuery = { ...state, ...partial };
    if (!('page' in partial)) nextState.page = 1;
    onReplaceParams(new URLSearchParams(stringifySearchUrl(nextState)));
  };

  const clearAll = () => onReplaceParams(new URLSearchParams());

  const checkboxGroup = <T extends string>(
    values: readonly T[],
    selected: readonly T[] | undefined,
    onToggle: (value: T) => void,
  ) => (
    <div className={searchStyles.optionList}>
      {values.map((value) => (
        <label key={value} className={searchStyles.checkboxLabel}>
          <input
            type="checkbox"
            className={searchStyles.checkboxInput}
            checked={selected?.includes(value) ?? false}
            onChange={() => onToggle(value)}
          />
          <span>{chipLabel(value)}</span>
        </label>
      ))}
    </div>
  );

  const numField = (
    label: string,
    key: keyof SearchPlatesQuery,
    opts?: { min?: number; step?: number },
  ) => (
    <label className={searchStyles.field}>
      <span className={searchStyles.fieldLabel}>{label}</span>
      <input
        type="number"
        className={searchStyles.fieldInput}
        min={opts?.min}
        step={opts?.step}
        value={typeof state[key] === 'number' ? (state[key] as number) : ''}
        onChange={(e) => {
          const raw = e.target.value;
          patch({ [key]: raw === '' ? undefined : Number(raw) } as Partial<SearchPlatesQuery>);
        }}
      />
    </label>
  );

  return (
    <div className={searchStyles.filtersRoot}>
      <div className={searchStyles.filtersHead}>
        <h2 className={searchStyles.filtersHeading}>Filtros</h2>
        <button type="button" className={searchStyles.filtersClear} onClick={clearAll}>
          Limpiar
        </button>
      </div>

      <Section id="filtros-orden" title="Orden">
        <label className={searchStyles.field}>
          <span className={searchStyles.fieldLabel}>Ordenar</span>
          <div className={searchStyles.selectWrap}>
            <select
              className={searchStyles.select}
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
            <span className={searchStyles.selectArrow} aria-hidden="true">
              ▼
            </span>
          </div>
        </label>
      </Section>

      <Section id="filtros-precio" title="Precio (menú)">
        <div className={searchStyles.fieldRow}>
          {numField('Mín.', 'minPrice', { min: 0 })}
          {numField('Máx.', 'maxPrice', { min: 0 })}
        </div>
      </Section>

      <Section id="filtros-tipo" title="Tipo de plato">
        {checkboxGroup(PLATE_TYPE_VALUES, state.recipeTypes, (value) =>
          patch({ recipeTypes: toggleArray(state.recipeTypes, value), page: 1 }),
        )}
      </Section>

      <Section id="filtros-tamano" title="Tamaño">
        {checkboxGroup(PLATE_SIZE_VALUES, state.sizes, (value) =>
          patch({ sizes: toggleArray(state.sizes, value), page: 1 }),
        )}
      </Section>

      <Section id="filtros-sabor" title="Sabor / receta">
        {checkboxGroup(FLAVOR_PROFILE_VALUES, state.flavors, (value) =>
          patch({ flavors: toggleArray(state.flavors, value), page: 1 }),
        )}
        <label className={searchStyles.field}>
          <span className={searchStyles.fieldLabel}>Dificultad</span>
          <div className={searchStyles.optionList}>
            {DIFFICULTY_VALUES.map((value) => (
              <label key={value} className={searchStyles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={searchStyles.checkboxInput}
                  checked={state.difficulties?.includes(value) ?? false}
                  onChange={() =>
                    patch({ difficulties: toggleArray(state.difficulties, value), page: 1 })
                  }
                />
                <span>{chipLabel(value)}</span>
              </label>
            ))}
          </div>
        </label>
      </Section>

      <Section id="filtros-nutricion" title="Nutrición declarada (plato)">
        <div className={searchStyles.fieldRow}>
          {numField('Cal mín', 'minCalories', { min: 0 })}
          {numField('Cal máx', 'maxCalories', { min: 0 })}
        </div>
        <div className={searchStyles.fieldRow}>
          {numField('Prot. mín g', 'minProtein', { min: 0, step: 0.1 })}
          {numField('Prot. máx g', 'maxProtein', { min: 0, step: 0.1 })}
        </div>
        <div className={searchStyles.fieldRow}>
          {numField('Grasa mín g', 'minFat', { min: 0, step: 0.1 })}
          {numField('Grasa máx g', 'maxFat', { min: 0, step: 0.1 })}
        </div>
        <div className={searchStyles.fieldRow}>
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
        <div className={searchStyles.fieldRow}>
          {numField('Porciones mín.', 'minYieldServings', { min: 1, step: 1 })}
          {numField('Porciones máx.', 'maxYieldServings', { min: 1, step: 1 })}
        </div>
      </Section>

      <Section id="filtros-alergenos" title="Sin alérgenos">
        {checkboxGroup(ALLERGEN_VALUES, state.excludeAllergens, (value) =>
          patch({ excludeAllergens: toggleArray(state.excludeAllergens, value), page: 1 }),
        )}
      </Section>

      <Section id="filtros-dieta" title="Etiquetas dieta (plato)">
        {checkboxGroup(DIETARY_TAG_VALUES, state.dietaryTags, (value) =>
          patch({ dietaryTags: toggleArray(state.dietaryTags, value), page: 1 }),
        )}
      </Section>

      <Section id="filtros-nutri-tags" title="Destacados nutricionales">
        {checkboxGroup(NUTRITION_TAG_VALUES, state.nutritionTags, (value) =>
          patch({ nutritionTags: toggleArray(state.nutritionTags, value), page: 1 }),
        )}
      </Section>

      <Section id="filtros-receta-dieta" title="Dieta a nivel receta">
        {checkboxGroup(DIETARY_TAG_VALUES, state.recipeDietaryTags, (value) =>
          patch({ recipeDietaryTags: toggleArray(state.recipeDietaryTags, value), page: 1 }),
        )}
      </Section>

      <Section id="filtros-tags-cartel" title="Etiquetas de carta (nombre)">
        <label className={searchStyles.field}>
          <span className={searchStyles.fieldLabel}>Separados por coma</span>
          <input
            type="text"
            className={searchStyles.fieldInput}
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
