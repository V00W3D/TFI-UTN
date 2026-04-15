/**
 * @file NavSearchBar.tsx
 * @module Landing
 * @description Renderiza la barra de busqueda del navbar con sugerencias y navegacion rapida.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: texto de busqueda del usuario y resultados del SDK
 * outputs: sugerencias navegables y redireccion al buscador
 * rules: buscar desde 2 caracteres; cerrar dropdown fuera del componente; conservar feedback de carga
 *
 * @technical
 * dependencies: react, framer-motion, react-router-dom, @app/sdk
 * flow: debouncea query; consulta SDK; muestra sugerencias; navega al search page
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-SEARCH-UI-01
 *
 * @notes
 * decisions: el hook debounce se expresa como arrow function para cumplir context.md
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { KeyboardEvent } from 'react';
import type { InferRequest } from '@app/sdk';
import type { SearchPlatesContract } from '@app/contracts';
import { sdk } from '@/shared/utils/sdk';
import { formatEnumLabel } from '@/shared/utils/enumLabels';
import { cn } from '@/styles/utils/cn';
import { navSearchFieldStyles, navigationStyles } from '@/styles/modules/navigation';

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="square"
    aria-hidden
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

const ImagePlaceholder = () => (
  <div className={navigationStyles.navSearchSuggestionPlaceholder} aria-hidden />
);

/* ─── Debounce hook ─── */
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

/* ─── Component ─── */
const NavSearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query.trim(), 300);
  const shouldSearch = debouncedQuery.length >= 2;

  /* Fetch suggestions */
  const res = sdk.customers.search.$use();
  useEffect(() => {
    if (!shouldSearch) return;
    void sdk.customers.search({ q: debouncedQuery, pageSize: 6 } as InferRequest<
      typeof SearchPlatesContract
    >);
  }, [debouncedQuery, shouldSearch]);

  const suggestions =
    shouldSearch && res.data && 'data' in res.data ? (res.data.data?.items ?? []).slice(0, 6) : [];

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback(
    (name: string) => {
      setOpen(false);
      setQuery('');
      navigate(`/search?q=${encodeURIComponent(name)}`);
    },
    [navigate],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
    if (e.key === 'Enter' && query.trim()) {
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <div ref={containerRef} className={navigationStyles.navSearchWrap}>
      <div className={navSearchFieldStyles({ open })}>
        <span className={navigationStyles.navSearchIcon}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          className={navigationStyles.navSearchInput}
          placeholder="Buscar platos…"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Buscar platos en el menú"
          aria-autocomplete="list"
          aria-controls="nav-search-listbox"
          aria-expanded={open && suggestions.length > 0}
        />
      </div>

      <AnimatePresence>
        {open && shouldSearch && (
          <motion.ul
            id="nav-search-listbox"
            role="listbox"
            key="nav-search-dropdown"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className={navigationStyles.navSearchDropdown}
          >
            {res.isFetching && suggestions.length === 0 && (
              <li
                className={cn(
                  navigationStyles.navSearchSuggestion,
                  navigationStyles.navSearchSuggestionState,
                )}
              >
                <span className={navigationStyles.navSearchStateText}>Buscando…</span>
              </li>
            )}
            {!res.isFetching && suggestions.length === 0 && (
              <li
                className={cn(
                  navigationStyles.navSearchSuggestion,
                  navigationStyles.navSearchSuggestionState,
                )}
              >
                <span className={navigationStyles.navSearchStateText}>
                  Sin resultados para "{debouncedQuery}"
                </span>
              </li>
            )}
            {suggestions.map((plate) => (
              <li
                key={plate.id}
                role="option"
                aria-selected={false}
                className={navigationStyles.navSearchSuggestion}
                onMouseDown={() => handleSelect(plate.name)}
              >
                <div className={navigationStyles.navSearchSuggestionImageWrap}>
                  {plate.imageUrl ? (
                    <img
                      src={plate.imageUrl}
                      alt={plate.name}
                      className={navigationStyles.navSearchSuggestionImage}
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
                <div className={navigationStyles.navSearchSuggestionBody}>
                  <span className={navigationStyles.navSearchSuggestionName}>{plate.name}</span>
                  <div className={navigationStyles.navSearchSuggestionMeta}>
                    {plate.size && (
                      <span className={navigationStyles.navSearchSuggestionType}>
                        {formatEnumLabel(plate.size)}
                      </span>
                    )}
                    {plate.menuPrice != null && (
                      <span className={navigationStyles.navSearchSuggestionPrice}>
                        ${Number(plate.menuPrice).toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {suggestions.length > 0 && (
              <li
                className={navigationStyles.navSearchFooter}
                onMouseDown={() => {
                  setOpen(false);
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  setQuery('');
                }}
              >
                <span>
                  Ver todos los resultados para "<strong>{debouncedQuery}</strong>"
                </span>
                <span className={navigationStyles.navSearchFooterArrow}>→</span>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavSearchBar;
