export interface PresetValues {
  defaultHeight: number;
  defaultWidth: number;
  defaultDepth: number;
  laborRate: number;
  materialMarkup: number;
  taxRate: number;
  deliveryFee: number;
  installationFee: number;
  storageFee: number;
  minimumOrder: number;
  rushOrderFee: number;
  shippingRate: number;
  importTaxRate: number;
  exchangeRate: number;
}

export interface FormulaStep {
  id: string;
  leftOperand: string;
  operator: string;
  rightOperand: string;
  rightOperandType: 'factor' | 'value';
}

export interface PricingRule {
  id: string;
  name: string;
  formula: FormulaStep[];
  result: string;
}