/**
 * @file index.tsx
 * @module ConfigSection
 * @description Vista de configuración de cuenta y apariencia.
 */
import { useMemo, useState } from 'react';
import { ConfigSectionCredentials } from '@/modules/Landing/ConfigSection/ConfigSectionCredentials';
import { ConfigSectionVisual } from '@/modules/Landing/ConfigSection/ConfigSectionVisual';
import { SettingsLayout, type SettingsTabDefinition } from '@/shared/ui/SettingsLayout';

type TabId = 'account' | 'appearance';

export const ConfigView = () => {
  const [activeTab, setActiveTab] = useState<TabId>('account');

  const tabs = useMemo<SettingsTabDefinition<TabId>[]>(
    () => [
      {
        id: 'account',
        label: 'Mi Cuenta',
        shortLabel: 'Mi Cuenta',
        description: 'Perfil, contacto y direcciones',
        status: 'Datos de la cuenta',
        component: <ConfigSectionCredentials />,
      },
      {
        id: 'appearance',
        label: 'Apariencia',
        shortLabel: 'Apariencia',
        description: 'Tema y preferencias visuales',
        status: 'Preferencias visuales',
        component: <ConfigSectionVisual />,
      },
    ],
    [],
  );

  return (
    <SettingsLayout
      title="Ajustes"
      subtitle="Cuenta, contacto y preferencias"
      moduleLabel="MÓDULO DE USUARIO"
      versionLabel="CONFIG_V3"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    />
  );
};

export default ConfigView;
