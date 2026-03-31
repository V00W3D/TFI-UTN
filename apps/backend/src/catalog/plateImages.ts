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
  return new URL(assetPath, `${backendUrl}/`).toString();
};
