/**
 * @file billingPlans.test.ts
 * @module Frontend/Tests/Landing
 * @description Tests unitarios para la configuración de planes de facturación.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-13
 * rnf: RNF-03
 *
 * @business
 * inputs: configuración de billingPlans
 * outputs: verificación de IDs, pricing y beneficios de los planes
 * rules: IDs deben ser REGULAR, VIP, PREMIUM; pricing debe ser ascendente; debe incluir IVA y ahorros anuales
 *
 * @technical
 * dependencies: vitest, billingPlans
 * flow: importa configuraciones; verifica longitudes y contenidos de los planes; aserta reglas de negocio de precios
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-BILLING-01
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se movió de src/ a tests/ para estandarización arquitectónica
 */
import { describe, expect, it } from 'vitest';
import { billingPlans } from '../../../src/modules/Landing/billingPlans';

describe('billingPlans', () => {
  it('expone los tres niveles esperados y en orden de valor', () => {
    expect(billingPlans.map((plan) => plan.id)).toEqual(['REGULAR', 'VIP', 'PREMIUM']);
  });

  it('calcula precios finales ascendentes segun el nivel', () => {
    const [regular, vip, premium] = billingPlans;

    expect(regular.pricing.finalPrice).toBeLessThan(vip.pricing.finalPrice);
    expect(vip.pricing.finalPrice).toBeLessThan(premium.pricing.finalPrice);
  });

  it('incluye IVA activo y ahorros anuales positivos en los planes pagos', () => {
    for (const plan of billingPlans) {
      expect(
        plan.pricing.activeTaxRules.some((rule) => rule.label === 'IVA' && rule.rate === 0.21),
      ).toBe(true);
      expect(plan.pricing.taxAmount).toBeGreaterThan(0);
      expect(plan.pricing.yearlyPrice).toBeGreaterThan(0);
      expect(plan.pricing.yearlySavings).toBeGreaterThanOrEqual(0);
    }
  });
});
