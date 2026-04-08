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
 * inputs: stores, hooks, params de ruta, modales y componentes del modulo
 * outputs: pantalla completa renderizada con sus flujos de interaccion
 * rules: coordinar estado de pagina sin duplicar logica de dominio
 *
 * @technical
 * dependencies: react, ConfigSectionCredentials, ConfigSectionVisual, SettingsLayout
 * flow: lee estado global y local de la pantalla; coordina formularios, fetches o modales; compone secciones reutilizables; renderiza la experiencia completa de la pagina.
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
 * decisions: la pagina orquesta estado y delega presentacion fina a componentes especializados
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
