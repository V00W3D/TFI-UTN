/**
 * @file index.tsx
 * @module SettingsLayout
 * @description Layout base para paneles de configuración con navegación lateral.
 */
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { SettingsHeader } from '@/shared/ui/SettingsLayout/components/SettingsHeader';
import { SettingsSidebar } from '@/shared/ui/SettingsLayout/components/SettingsSidebar';
import { settingsStyles } from '@/styles/modules/settings';

export interface SettingsTabDefinition<TTab extends string> {
  id: TTab;
  label: string;
  shortLabel: string;
  description: string;
  status: string;
  component: ReactNode;
}

interface SettingsLayoutProps<TTab extends string> {
  title: string;
  subtitle: string;
  moduleLabel: string;
  versionLabel: string;
  activeTab: TTab;
  onTabChange: (tab: TTab) => void;
  tabs: SettingsTabDefinition<TTab>[];
}

export const SettingsLayout = <TTab extends string>({
  title,
  subtitle,
  moduleLabel,
  versionLabel,
  activeTab,
  onTabChange,
  tabs,
}: SettingsLayoutProps<TTab>) => {
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className={settingsStyles.layoutRoot}>
      <div className={settingsStyles.layoutShell}>
        <SettingsHeader 
          title={title} 
          subtitle={subtitle} 
          moduleLabel={moduleLabel} 
          versionLabel={versionLabel} 
        />

        <div className={settingsStyles.layoutGrid}>
          <SettingsSidebar 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={onTabChange} 
            currentStatus={currentTab?.status} 
          />

          <main className={settingsStyles.contentShell}>
            <div className={settingsStyles.contentPanel}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                >
                  {currentTab?.component}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
