import { PresetValues, PricingRule } from '../types/preset';

const defaultPresetValues: PresetValues = {
  defaultHeight: 30,
  defaultWidth: 24,
  defaultDepth: 24,
  laborRate: 75,
  materialMarkup: 30,
  taxRate: 13,
  deliveryFee: 150,
  installationFee: 500,
  storageFee: 25,
  minimumOrder: 1000,
  rushOrderFee: 15,
  shippingRate: 2.5,
  importTaxRate: 5,
  exchangeRate: 1
};

const defaultRules: PricingRule[] = [
  {
    id: '1',
    name: 'Base Cost Calculation',
    formula: [
      {
        id: crypto.randomUUID(),
        leftOperand: 'base_price',
        operator: '*',
        rightOperand: 'material_markup',
        rightOperandType: 'factor',
      },
    ],
    result: 'unit_cost',
  },
  {
    id: '2',
    name: 'Shipping Cost Calculation',
    formula: [
      {
        id: crypto.randomUUID(),
        leftOperand: 'width',
        operator: '*',
        rightOperand: 'height',
        rightOperandType: 'factor',
      },
      {
        id: crypto.randomUUID(),
        leftOperand: 'shipping_rate',
        operator: '*',
        rightOperand: 'depth',
        rightOperandType: 'factor',
      },
    ],
    result: 'shipping_cost',
  },
];

export function getPresetValues(): PresetValues {
  const stored = localStorage.getItem('presetValues');
  if (!stored) {
    localStorage.setItem('presetValues', JSON.stringify(defaultPresetValues));
    return defaultPresetValues;
  }
  return JSON.parse(stored);
}

export function savePresetValues(values: PresetValues): void {
  localStorage.setItem('presetValues', JSON.stringify(values));
}

export function getPricingRules(): PricingRule[] {
  const stored = localStorage.getItem('pricingRules');
  if (!stored) {
    localStorage.setItem('pricingRules', JSON.stringify(defaultRules));
    return defaultRules;
  }
  return JSON.parse(stored);
}

export function savePricingRules(rules: PricingRule[]): void {
  localStorage.setItem('pricingRules', JSON.stringify(rules));
}