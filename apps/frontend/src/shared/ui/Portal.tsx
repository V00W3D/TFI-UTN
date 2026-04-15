/**
 * @file Portal.tsx
 * @module Frontend
 * @description Archivo Portal alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react, react-dom
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
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
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * @file Portal.tsx
 * @description A simple wrapper to render children into the #portal-root element.
 */
interface PortalProps {
  children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const portalRoot = document.getElementById('portal-root');

  if (!portalRoot) {
    return <>{children}</>;
  }

  return createPortal(children, portalRoot);
};

export default Portal;
