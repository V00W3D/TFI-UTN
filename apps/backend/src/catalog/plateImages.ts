/**
 * @file plateImages.ts
 * @module Backend
 * @description Archivo plateImages alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: configuracion, modulos compartidos o datos semilla del backend
 * outputs: constantes, bootstrap, helpers de catalogo o datos iniciales
 * rules: mantener coherencia con entorno, contratos y datos base
 *
 * @technical
 * dependencies: sin imports directos; consumido por el modulo correspondiente
 * flow: carga configuracion o datos base; coordina dependencias de infraestructura; expone constantes, helpers o bootstrap segun su responsabilidad.
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
 * decisions: los archivos raiz concentran bootstrap y soporte comun del backend
 */
export const PLATE_IMAGE_ROUTE_PREFIX = '/assets/plates';

export const PLATE_IMAGES = {
  pizzaMuzzarellaClasica: `${PLATE_IMAGE_ROUTE_PREFIX}/pizza-muzzarella-clasica.webp`,
  pizzaEspecialJamonMorron: `${PLATE_IMAGE_ROUTE_PREFIX}/pizza-especial-jamon-morron.webp`,
  sangucheMilanesaCompletoAji: `${PLATE_IMAGE_ROUTE_PREFIX}/sanguche-milanesa-completo-aji.webp`,
  sangucheMilanesaCompletoSinAji: `${PLATE_IMAGE_ROUTE_PREFIX}/sanguche-milanesa-completo-sin-aji.webp`,
  sangucheMilanesaPollo: `${PLATE_IMAGE_ROUTE_PREFIX}/sanguche-milanesa-pollo.webp`,
  milanesaNapolitanaPapas: `${PLATE_IMAGE_ROUTE_PREFIX}/milanesa-napolitana-papas.webp`,
  hamburguesaClasicaCheddarBacon: `${PLATE_IMAGE_ROUTE_PREFIX}/hamburguesa-clasica-cheddar-bacon.webp`,
  hamburguesaPolloCrispy: `${PLATE_IMAGE_ROUTE_PREFIX}/hamburguesa-pollo-crispy.webp`,
  empanadasCarneX3: `${PLATE_IMAGE_ROUTE_PREFIX}/empanadas-carne-x3.webp`,
  empanadasJamonQuesoX3: `${PLATE_IMAGE_ROUTE_PREFIX}/empanadas-jamon-queso-x3.webp`,
  papasFritasClasicas: `${PLATE_IMAGE_ROUTE_PREFIX}/papas-fritas-clasicas.webp`,
} as const;

export const resolveAssetUrl = (assetPath: string | null | undefined, backendUrl: string) => {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  if (!backendUrl) return assetPath;
  return new URL(assetPath, `${backendUrl}/`).toString();
};
