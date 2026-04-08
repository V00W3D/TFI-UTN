/**
 * @file ConfigPage.tsx
 * @module Landing
 * @description Archivo ConfigPage alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
import { useMemo, useState } from 'react';
import { ConfigSectionCredentials } from '../components/ConfigSectionCredentials';
import { ConfigSectionVisual } from '../components/ConfigSectionVisual';
import { SettingsLayout, type SettingsTabDefinition } from '../components/settings/SettingsLayout';

type TabId = 'account' | 'appearance';

const ConfigPage = () => {
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

export default ConfigPage;
