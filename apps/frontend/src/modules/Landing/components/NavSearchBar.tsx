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
import { sdk } from '../../../tools/sdk';
import type { InferRequest } from '@app/sdk';
import type { SearchPlatesContract } from '@app/contracts';
import { formatEnumLabel } from '../../../tools/enumLabels';

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

const ImagePlaceholder = () => <div className="nav-search-suggestion__ph" aria-hidden />;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    <div ref={containerRef} className="nav-search-wrap">
      <div className={`nav-search-field ${open ? 'nav-search-field--open' : ''}`}>
        <span className="nav-search-ico">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          className="nav-search-input"
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
            className="nav-search-dropdown"
          >
            {res.isFetching && suggestions.length === 0 && (
              <li className="nav-search-suggestion nav-search-suggestion--state">
                <span className="nav-search-state-text">Buscando…</span>
              </li>
            )}
            {!res.isFetching && suggestions.length === 0 && (
              <li className="nav-search-suggestion nav-search-suggestion--state">
                <span className="nav-search-state-text">
                  Sin resultados para "{debouncedQuery}"
                </span>
              </li>
            )}
            {suggestions.map((plate) => (
              <li
                key={plate.id}
                role="option"
                aria-selected={false}
                className="nav-search-suggestion"
                onMouseDown={() => handleSelect(plate.name)}
              >
                <div className="nav-search-suggestion__img-wrap">
                  {plate.imageUrl ? (
                    <img
                      src={plate.imageUrl}
                      alt={plate.name}
                      className="nav-search-suggestion__img"
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
                <div className="nav-search-suggestion__body">
                  <span className="nav-search-suggestion__name">{plate.name}</span>
                  <div className="nav-search-suggestion__meta">
                    {plate.size && (
                      <span className="nav-search-suggestion__type">
                        {formatEnumLabel(plate.size)}
                      </span>
                    )}
                    {plate.menuPrice != null && (
                      <span className="nav-search-suggestion__price">
                        ${Number(plate.menuPrice).toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {suggestions.length > 0 && (
              <li
                className="nav-search-dropdown__footer"
                onMouseDown={() => {
                  setOpen(false);
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  setQuery('');
                }}
              >
                <span>
                  Ver todos los resultados para "<strong>{debouncedQuery}</strong>"
                </span>
                <span className="nav-search-dropdown__arrow">→</span>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavSearchBar;
