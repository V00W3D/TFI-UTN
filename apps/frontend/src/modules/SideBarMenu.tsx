import { useState } from 'react';
import { createPortal } from 'react-dom';
import ToggleModeButton from './ToggleModeButton';
import './sidebar-menu.css';

const SidebarMenu = () => {
  const [expanded, setExpanded] = useState(false);

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  return createPortal(
    <aside className={`sidebar ${expanded ? 'sidebar--expanded' : ''}`} aria-label="Menú principal">
      <nav className="sidebar__nav">
        {/* ── Brand ── */}
        <div className="sidebar__row sidebar__row--brand">
          <div className="sidebar__icon-cell">
            <img src="/QART_LOGO.png" alt="" className="sidebar__icon size-30" aria-hidden="true" />
          </div>
          {expanded && <span className="sidebar__label sidebar__label--brand">QART</span>}
        </div>

        {/* ── Perfil ── */}
        <div className="sidebar__row">
          <div className="sidebar__icon-cell">
            <img
              src="/user-icon.png"
              alt=""
              className="sidebar__icon sidebar__icon--avatar"
              aria-hidden="true"
            />
          </div>
          {expanded && <span className="sidebar__label">Perfil</span>}
        </div>

        <div className="sidebar__divider" role="separator" />

        {/* ── Toggle modo — el row lo pone el sidebar, no el botón ── */}
        <ToggleModeButton expanded={expanded} />
      </nav>

      {/* ── Expand / Collapse ── */}
      <div className="sidebar__footer">
        <button
          className="sidebar__row sidebar__row--toggle"
          onClick={() => setExpanded((p) => !p)}
          aria-label={expanded ? 'Contraer menú' : 'Expandir menú'}
          aria-expanded={expanded}
        >
          <div className="sidebar__icon-cell sidebar__icon-cell--toggle">
            <span
              className={`sidebar__chevron ${expanded ? 'sidebar__chevron--flipped' : ''}`}
              aria-hidden="true"
            >
              ›
            </span>
          </div>
          {expanded && <span className="sidebar__label">Contraer</span>}
        </button>
      </div>
    </aside>,
    portalRoot,
  );
};

export default SidebarMenu;
