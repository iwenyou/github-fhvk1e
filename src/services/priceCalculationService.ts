import { PricingRule } from '../types/preset';
import { getPricingRules } from './presetService';

function evaluateFormula(
  basePrice: number,
  width: number,
  height: number,
  depth: number,
  rules: PricingRule[]
): { [key: string]: number } {
  const values: { [key: string]: number } = {
    base_price: basePrice,
    width,
    height,
    depth,
    // Calculate area and volume
    area: width * height,
    volume: width * height * depth,
    // Default preset values
    material_markup: 1.3,
    shipping_rate: 2.5,
    import_tax_rate: 0.05,
    storage_fee: 25,
    exchange_rate: 1
  };

  // Process rules in order
  rules.forEach(rule => {
    let result = 0;
    
    rule.formula.forEach((step, index) => {
      const leftValue = index === 0 
        ? values[step.leftOperand] || 0
        : result;
      
      const rightValue = step.rightOperandType === 'factor'
        ? values[step.rightOperand] || 0
        : Number(step.rightOperand);

      switch (step.operator) {
        case '+':
          result = leftValue + rightValue;
          break;
        case '-':
          result = leftValue - rightValue;
          break;
        case '*':
          result = leftValue * rightValue;
          break;
        case '/':
          result = rightValue !== 0 ? leftValue / rightValue : 0;
          break;
        case '%':
          result = leftValue * (rightValue / 100);
          break;
      }
    });

    values[rule.result] = result;
  });

  return values;
}

export function calculateDisplayedPrice(
  basePrice: number,
  width: number,
  height: number,
  depth: number
): number {
  const rules = getPricingRules();
  const values = evaluateFormula(basePrice, width, height, depth, rules);
  return values.displayed_price || values.final_price || basePrice;
}