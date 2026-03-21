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
        <div className="sidebar__row sidebar__row--brand">
          <div className="sidebar__icon-cell">
            <img src="/restaurant-logo.png" alt="" className="sidebar__icon" aria-hidden="true" />
          </div>
          {expanded && <span className="sidebar__label sidebar__label--brand">QART</span>}
        </div>

        <div className="sidebar__row">
          <div className="sidebar__icon-cell">
            <img
              src="/profile-icon.png"
              alt=""
              className="sidebar__icon sidebar__icon--avatar"
              aria-hidden="true"
            />
          </div>
          {expanded && <span className="sidebar__label">Perfil</span>}
        </div>

        <div className="sidebar__divider" role="separator" />

        <div className="sidebar__row">
          <ToggleModeButton expanded={expanded} />
        </div>
      </nav>

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
        </button>
      </div>
    </aside>,
    portalRoot,
  );
};

export default SidebarMenu;
