/**
 * @file ToggleModeButton.tsx
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
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
