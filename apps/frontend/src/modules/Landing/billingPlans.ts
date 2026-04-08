import {
  DEFAULT_RESTAURANT_PRICING_CONFIG,
  calculateIngredientSalePrice,
  roundPublicMenuPriceARS,
  type PricingTaxRule,
} from '@app/sdk';

export type BillingPlanId = 'REGULAR' | 'VIP' | 'PREMIUM';

type BillingSeed = {
  id: BillingPlanId;
  name: string;
  eyebrow: string;
  accentClassName: string;
  summary: string;
  monthlyCostNet: number;
  qartMultiplier: number;
  redemptionCopy: string;
  differentiator: string;
  features: string[];
};

export type BillingPlan = BillingSeed & {
  pricing: {
    currencyCode: string;
    costPrice: number;
    netPrice: number;
    taxAmount: number;
    finalPrice: number;
    yearlyPrice: number;
    yearlySavings: number;
    activeTaxRules: PricingTaxRule[];
  };
};

const BILLING_SEEDS: BillingSeed[] = [
  {
    id: 'REGULAR',
    name: 'Regular',
    eyebrow: 'Entrada al ecosistema',
    accentClassName: 'bg-qart-primary',
    summary:
      'Para quien quiere comer mejor, sumar puntos QART y ver la informacion nutricional esencial sin pagar de mas.',
    monthlyCostNet: 6200,
    qartMultiplier: 1,
    redemptionCopy: 'Canjea descuentos simples y beneficios base del menu.',
    differentiator: 'Compra comida con una capa de informacion y recompensas.',
    features: [
      'Acceso al menu estandar',
      'Calorias y macros simples por plato',
      'Acumulacion base de puntos QART',
      'Descuentos simples y canjes iniciales',
    ],
  },
  {
    id: 'VIP',
    name: 'VIP',
    eyebrow: 'Personalizacion ligera',
    accentClassName: 'bg-qart-accent',
    summary:
      'Para quien ya no quiere elegir a ciegas: define objetivo, recibe sugerencias y empieza a usar al restaurante como apoyo nutricional.',
    monthlyCostNet: 12400,
    qartMultiplier: 1.4,
    redemptionCopy: 'Accede a combos exclusivos y descuentos mas eficientes.',
    differentiator: 'El restaurante ya piensa por vos y te recomienda segun objetivo.',
    features: [
      'Todo lo del plan Regular',
      'Perfil nutricional con objetivo: bajar grasa, volumen o mantenimiento',
      'Recomendaciones automaticas de platos segun objetivo',
      'Historial de consumo con seguimiento basico',
      'Asistente de dieta simple con sugerencias del dia',
    ],
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    eyebrow: 'Coach nutricional completo',
    accentClassName: 'bg-qart-success',
    summary:
      'Para quien quiere convertir el restaurante en un sistema de acompanamiento real, con planificacion, correcciones dinamicas y beneficios concretos.',
    monthlyCostNet: 24800,
    qartMultiplier: 2,
    redemptionCopy: 'Habilita platos personalizados, menu oculto y beneficios unicos.',
    differentiator: 'No solo recomienda: te guia, recalcula y acompana tu progreso.',
    features: [
      'Todo lo del plan VIP',
      'Plan de dieta semanal o mensual',
      'Ajustes dinamicos segun comportamiento y desvio del objetivo',
      'Metricas avanzadas: consumo vs objetivo y progreso estimado',
      'Prioridad en pedidos y acceso a menu oculto o platos personalizados',
      'Recordatorios, sugerencias fuera del restaurante y bonus QART',
    ],
  },
];

const getTaxAmount = (netPrice: number, salePrice: number) => Math.max(0, salePrice - netPrice);

const getYearlyPrice = (monthlyPrice: number) => roundPublicMenuPriceARS(monthlyPrice * 10);

export const billingPlans: BillingPlan[] = BILLING_SEEDS.map((seed) => {
  const pricingBase = calculateIngredientSalePrice(
    {
      pricingBasisGrams: 1,
      unitCostNet: seed.monthlyCostNet,
      purchaseUnitLabel: 'mes',
      supplierKey: null,
      supplierName: null,
    },
    DEFAULT_RESTAURANT_PRICING_CONFIG,
  );

  const yearlyPrice = getYearlyPrice(pricingBase.salePrice);

  return {
    ...seed,
    pricing: {
      currencyCode: DEFAULT_RESTAURANT_PRICING_CONFIG.currencyCode,
      costPrice: pricingBase.costPrice,
      netPrice: pricingBase.netPrice,
      taxAmount: getTaxAmount(pricingBase.netPrice, pricingBase.salePrice),
      finalPrice: pricingBase.salePrice,
      yearlyPrice,
      yearlySavings: Math.max(0, pricingBase.salePrice * 12 - yearlyPrice),
      activeTaxRules: DEFAULT_RESTAURANT_PRICING_CONFIG.taxRules.filter(
        (rule) => rule.isActive && rule.includedInMenuPrice,
      ),
    },
  };
});
