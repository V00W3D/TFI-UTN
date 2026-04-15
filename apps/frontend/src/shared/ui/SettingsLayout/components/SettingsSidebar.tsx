import type { SettingsTabDefinition } from '@/shared/ui/SettingsLayout';
import {
  settingsStyles,
  settingsTabButtonStyles,
  settingsTabSummaryStyles,
} from '@/styles/modules/settings';

interface SettingsSidebarProps<TTab extends string> {
  tabs: SettingsTabDefinition<TTab>[];
  activeTab: TTab;
  onTabChange: (tab: TTab) => void;
  currentStatus?: string | undefined;
}

export const SettingsSidebar = <TTab extends string>({
  tabs,
  activeTab,
  onTabChange,
  currentStatus,
}: SettingsSidebarProps<TTab>) => (
  <aside className={settingsStyles.sidebar}>
    <div className={settingsStyles.sidebarHead}>
      <div className={settingsStyles.sidebarIconBox}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="square"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </div>
      <div>
        <h2 className={settingsStyles.sidebarTitle}>
          Menú
        </h2>
        <p className={settingsStyles.sidebarLead}>
          Navegación simple
        </p>
      </div>
    </div>

    <nav className={settingsStyles.sidebarNav}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={settingsTabButtonStyles({ active: isActive })}
          >
            <span className={settingsStyles.sidebarTabLabel}>
              {isActive && <span className={settingsStyles.sidebarTabDot} />}
              {tab.shortLabel}
            </span>
            <span className={settingsTabSummaryStyles({ active: isActive })}>
              {tab.description}
            </span>
          </button>
        );
      })}
    </nav>

    <div className={settingsStyles.sidebarFooter}>
      <p className={settingsStyles.sidebarFooterText}>
        {currentStatus}
      </p>
    </div>
  </aside>
);
