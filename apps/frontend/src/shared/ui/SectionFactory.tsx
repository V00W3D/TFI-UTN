/**
 * @file SectionFactory.tsx
 * @module Frontend
 * @description Archivo SectionFactory alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: react
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

export interface SectionFactoryItem {
  key: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  content: ReactNode;
  className?: string;
}

interface SectionFactoryProps {
  sections: SectionFactoryItem[];
  className?: string;
  sectionClassName?: string;
  headerClassName?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const SectionFactory = ({
  sections,
  className,
  sectionClassName,
  headerClassName,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: SectionFactoryProps) => (
  <div className={className}>
    {sections.map((section) => (
      <section key={section.key} className={section.className ?? sectionClassName}>
        <div className={headerClassName}>
          {section.eyebrow && <p className={eyebrowClassName}>{section.eyebrow}</p>}
          {section.title && <h3 className={titleClassName}>{section.title}</h3>}
          {section.description && <p className={descriptionClassName}>{section.description}</p>}
        </div>
        {section.content}
      </section>
    ))}
  </div>
);
