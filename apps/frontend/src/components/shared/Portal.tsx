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
