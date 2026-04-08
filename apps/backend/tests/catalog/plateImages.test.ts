/**
 * @file plateImages.test.ts
 * @module Backend/Tests/Catalog
 * @description Tests unitarios para utilidades de resolución de imágenes de platos.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: assetPath (string/null), serverUrl
 * outputs: URL absoluta resuelta o null
 * rules: si el path es absoluto, se preserva; si es relativo, se concatena al serverUrl; si es nulo, retorna nulo
 *
 * @technical
 * dependencies: vitest, plateImages
 * flow: ejercita resolveAssetUrl con distintos tipos de path; verifica consistencia de PLATE_IMAGE_ROUTE_PREFIX
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-PLATE-IMAGES-01
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se movió de src/ a tests/ para estandarización arquitectónica
 */
import { describe, expect, it } from 'vitest';
import { PLATE_IMAGE_ROUTE_PREFIX, PLATE_IMAGES, resolveAssetUrl } from '../../src/catalog/plateImages';

describe('plateImages', () => {
  it('mantiene el prefijo publico de assets de platos', () => {
    expect(PLATE_IMAGE_ROUTE_PREFIX).toBe('/assets/plates');
    expect(PLATE_IMAGES.pizzaMuzzarellaClasica).toContain(PLATE_IMAGE_ROUTE_PREFIX);
  });

  it('respeta urls absolutas y resuelve relativas contra el backend', () => {
    expect(resolveAssetUrl('https://cdn.example.com/plate.webp', 'http://localhost:3000')).toBe(
      'https://cdn.example.com/plate.webp',
    );
    expect(resolveAssetUrl('/assets/plates/demo.webp', 'http://localhost:3000')).toBe(
      'http://localhost:3000/assets/plates/demo.webp',
    );
  });

  it('devuelve null si no hay assetPath', () => {
    expect(resolveAssetUrl(null, 'http://localhost:3000')).toBeNull();
    expect(resolveAssetUrl(undefined, 'http://localhost:3000')).toBeNull();
  });
});
