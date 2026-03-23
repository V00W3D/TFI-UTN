import { useAppStore } from '@store';

interface ToggleModeButtonProps {
  expanded?: boolean;
}

const ToggleModeButton = ({ expanded = false }: ToggleModeButtonProps) => {
  const { mode, setMode } = useAppStore();
  const isDark = mode === 'dark';

  return (
    <button
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      className="sidebar__row"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <div className="sidebar__icon-cell">
        <span className="sidebar__toggle-icon" aria-hidden="true">
          {isDark ? '☀' : '☾'}
        </span>
      </div>
      {expanded && <span className="sidebar__label">Tema</span>}
    </button>
  );
};

export default ToggleModeButton;
