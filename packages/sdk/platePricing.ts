import {
  resolvePlateComponents,
  type PlateNutritionIngredientLike,
  type PlateNutritionPlateLike,
} from './plateNutrition';

export interface PricingTaxRule {
  key: string;
  label: string;
  rate: number;
  isActive: boolean;
  includedInMenuPrice: boolean;
  sourceLabel: string;
  note: string;
}

export interface RestaurantPricingConfig {
  markupRate: number;
  currencyCode: string;
  taxRules: PricingTaxRule[];
}

export interface IngredientProcurementSnapshot {
  pricingBasisGrams: number;
  unitCostNet: number;
  purchaseUnitLabel: string | null;
  supplierKey: string | null;
  supplierName: string | null;
}

export interface IngredientInventorySnapshot {
  storageType: string | null;
  storageLabel: string | null;
  maxStockGrams: number | null;
  currentStockGrams: number | null;
  reorderPointGrams: number | null;
}

export interface IngredientOperationalSnapshot {
  procurement: IngredientProcurementSnapshot;
  inventory: IngredientInventorySnapshot;
}

export interface PlatePricingIngredientBreakdown {
  ingredientId: string;
  ingredientName: string;
  quantityGrams: number;
  pricingBasisGrams: number;
  unitCostNet: number;
  costAmountNet: number;
  supplierName: string | null;
  storageLabel: string | null;
}

export interface PlateTaxBreakdown {
  key: string;
  label: string;
  rate: number;
  amount: number;
  includedInMenuPrice: boolean;
  sourceLabel: string;
  note: string;
}

export interface PlatePricingAnalysis {
  ingredientBreakdown: PlatePricingIngredientBreakdown[];
  costPrice: number;
  netPrice: number;
  profitAmount: number;
  taxAmount: number;
  menuPrice: number;
  taxBreakdown: PlateTaxBreakdown[];
  missingIngredientIds: string[];
}

type UnknownRecord = Record<string, unknown>;

const DEFAULT_PRICING_BASIS_GRAMS = 100;

const roundMoney = (value: number) => Number(value.toFixed(2));

const asRecord = (value: unknown): UnknownRecord | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;

const asNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
};

const asString = (value: unknown) => (typeof value === 'string' && value.trim() ? value : null);

export const ARGENTINE_RESTAURANT_TAX_RULES: PricingTaxRule[] = [
  {
    key: 'vat',
    label: 'IVA',
    rate: 0.21,
    isActive: true,
    includedInMenuPrice: true,
    sourceLabel: 'ARCA / Ley de IVA art. 28',
    note: 'Se aplica la alicuota general del 21% sobre el neto de venta.',
  },
  {
    key: 'gross_revenue',
    label: 'Ingresos Brutos',
    rate: 0,
    isActive: false,
    includedInMenuPrice: true,
    sourceLabel: 'Configurable por jurisdiccion',
    note: 'Se deja listo para activarse segun provincia y regimen fiscal del restaurante.',
  },
  {
    key: 'municipal_fee',
    label: 'Tasa municipal',
    rate: 0,
    isActive: false,
    includedInMenuPrice: true,
    sourceLabel: 'Configurable por municipio',
    note: 'La carga municipal cambia segun localidad y actividad.',
  },
  {
    key: 'banking_tax',
    label: 'Impuesto sobre debitos y creditos',
    rate: 0,
    isActive: false,
    includedInMenuPrice: true,
    sourceLabel: 'Configurable por operatoria bancaria',
    note: 'Su incidencia real depende del medio de cobro y del regimen aplicable.',
  },
];

export const DEFAULT_RESTAURANT_PRICING_CONFIG: RestaurantPricingConfig = {
  markupRate: 0.3,
  currencyCode: 'ARS',
  taxRules: ARGENTINE_RESTAURANT_TAX_RULES,
};

export const getIngredientOperationalSnapshot = (
  ingredient: Pick<PlateNutritionIngredientLike, 'extraAttributes'>,
): IngredientOperationalSnapshot | null => {
  const root = asRecord(ingredient.extraAttributes);
  const procurementRoot = asRecord(root?.procurement ?? root?.operations);
  const inventoryRoot = asRecord(root?.inventory);
  const pricingBasisGrams =
    asNumber(procurementRoot?.pricingBasisGrams) ?? DEFAULT_PRICING_BASIS_GRAMS;
  const unitCostNet = asNumber(procurementRoot?.unitCostNet);

  if (unitCostNet == null) return null;

  return {
    procurement: {
      pricingBasisGrams,
      unitCostNet,
      purchaseUnitLabel: asString(procurementRoot?.purchaseUnitLabel),
      supplierKey: asString(procurementRoot?.supplierKey),
      supplierName: asString(procurementRoot?.supplierName),
    },
    inventory: {
      storageType: asString(inventoryRoot?.storageType),
      storageLabel: asString(inventoryRoot?.storageLabel),
      maxStockGrams: asNumber(inventoryRoot?.maxStockGrams),
      currentStockGrams: asNumber(inventoryRoot?.currentStockGrams),
      reorderPointGrams: asNumber(inventoryRoot?.reorderPointGrams),
    },
  };
};

export const calculateIngredientSalePrice = (
  procurement: IngredientProcurementSnapshot,
  pricingConfig: RestaurantPricingConfig = DEFAULT_RESTAURANT_PRICING_CONFIG,
) => {
  const netPrice = procurement.unitCostNet * (1 + pricingConfig.markupRate);
  const taxAmount = pricingConfig.taxRules
    .filter((rule) => rule.isActive && rule.includedInMenuPrice)
    .reduce((total, rule) => total + netPrice * rule.rate, 0);

  return {
    costPrice: roundMoney(procurement.unitCostNet),
    netPrice: roundMoney(netPrice),
    salePrice: roundMoney(netPrice + taxAmount),
  };
};

export const analyzePlatePricing = (
  plate: PlateNutritionPlateLike,
  pricingConfig: RestaurantPricingConfig = DEFAULT_RESTAURANT_PRICING_CONFIG,
): PlatePricingAnalysis => {
  const components = resolvePlateComponents(plate);
  const ingredientBreakdown: PlatePricingIngredientBreakdown[] = [];
  const missingIngredientIds: string[] = [];

  for (const component of components) {
    const operationalSnapshot = getIngredientOperationalSnapshot(component.variant.ingredient);

    if (!operationalSnapshot) {
      missingIngredientIds.push(component.variant.ingredient.id);
      continue;
    }

    const pricingBasisGrams =
      operationalSnapshot.procurement.pricingBasisGrams > 0
        ? operationalSnapshot.procurement.pricingBasisGrams
        : DEFAULT_PRICING_BASIS_GRAMS;
    const costAmountNet =
      (component.quantityGrams * operationalSnapshot.procurement.unitCostNet) / pricingBasisGrams;

    ingredientBreakdown.push({
      ingredientId: component.variant.ingredient.id,
      ingredientName: component.variant.ingredient.name,
      quantityGrams: roundMoney(component.quantityGrams),
      pricingBasisGrams,
      unitCostNet: roundMoney(operationalSnapshot.procurement.unitCostNet),
      costAmountNet: roundMoney(costAmountNet),
      supplierName: operationalSnapshot.procurement.supplierName,
      storageLabel: operationalSnapshot.inventory.storageLabel,
    });
  }

  const costPrice = roundMoney(
    ingredientBreakdown.reduce((total, ingredient) => total + ingredient.costAmountNet, 0),
  );
  const profitAmount = roundMoney(costPrice * pricingConfig.markupRate);
  const netPrice = roundMoney(costPrice + profitAmount);
  const taxBreakdown = pricingConfig.taxRules
    .filter((rule) => rule.isActive)
    .map((rule) => ({
      key: rule.key,
      label: rule.label,
      rate: rule.rate,
      amount: roundMoney(netPrice * rule.rate),
      includedInMenuPrice: rule.includedInMenuPrice,
      sourceLabel: rule.sourceLabel,
      note: rule.note,
    }));
  const taxAmount = roundMoney(
    taxBreakdown
      .filter((rule) => rule.includedInMenuPrice)
      .reduce((total, rule) => total + rule.amount, 0),
  );

  return {
    ingredientBreakdown,
    costPrice,
    netPrice,
    profitAmount,
    taxAmount,
    menuPrice: roundMoney(netPrice + taxAmount),
    taxBreakdown,
    missingIngredientIds: Array.from(new Set(missingIngredientIds)),
  };
};
