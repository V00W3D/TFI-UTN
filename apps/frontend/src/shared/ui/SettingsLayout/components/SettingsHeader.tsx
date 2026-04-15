import { settingsStyles } from '@/styles/modules/settings';

interface SettingsHeaderProps {
  title: string;
  subtitle: string;
  moduleLabel: string;
  versionLabel: string;
}

export const SettingsHeader = ({ title, subtitle, moduleLabel, versionLabel }: SettingsHeaderProps) => (
  <header className={settingsStyles.header}>
    <div className={settingsStyles.headerAccent} />
    <div className={settingsStyles.headerRow}>
      <div className={settingsStyles.headerCopy}>
        <h1 className={settingsStyles.headerTitle}>
          {title} <span className={settingsStyles.headerTitleAccent}>/</span>
        </h1>
        <p className={settingsStyles.headerSubtitle}>
          <span className={settingsStyles.headerSubtitleRule} />
          {subtitle}
        </p>
      </div>

      <div className={settingsStyles.headerMeta}>
        <span className={settingsStyles.headerModule}>
          {moduleLabel}
        </span>
        <span className={settingsStyles.headerVersion}>{versionLabel}</span>
      </div>
    </div>
  </header>
);
