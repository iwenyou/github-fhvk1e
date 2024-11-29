import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { PricingRule, FormulaStep } from '../../types/preset';
import { getPricingRules, savePricingRules } from '../../services/presetService';

const defaultFormulaStep: Omit<FormulaStep, 'id'> = {
  leftOperand: 'base_price',
  operator: '+',
  rightOperand: '0',
  rightOperandType: 'value',
};

const pricingFactors = [
  // Dimensions
  { value: 'width', label: 'Width (inches)' },
  { value: 'height', label: 'Height (inches)' },
  { value: 'depth', label: 'Depth (inches)' },
  { value: 'area', label: 'Area (sq inches)' },
  { value: 'volume', label: 'Volume (cubic inches)' },
  { value: 'base_price', label: 'Base Price' },
  
  // Preset Values
  { value: 'default_height', label: 'Default Height' },
  { value: 'default_width', label: 'Default Width' },
  { value: 'default_depth', label: 'Default Depth' },
  { value: 'labor_rate', label: 'Labor Rate' },
  { value: 'material_markup', label: 'Material Markup' },
  { value: 'tax_rate', label: 'Tax Rate' },
  { value: 'delivery_fee', label: 'Delivery Fee' },
  { value: 'installation_fee', label: 'Installation Fee' },
  { value: 'storage_fee', label: 'Storage Fee' },
  { value: 'minimum_order', label: 'Minimum Order' },
  { value: 'rush_order_fee', label: 'Rush Order Fee' },
  { value: 'shipping_rate', label: 'Shipping Rate' },
  { value: 'import_tax_rate', label: 'Import Tax Rate' },
  { value: 'exchange_rate', label: 'Exchange Rate' },
  
  // Calculation Factors
  { value: 'unit_cost', label: 'Unit Cost' },
  { value: 'shipping_cost', label: 'Shipping Cost' },
  { value: 'import_tax', label: 'Import Tax' },
  { value: 'storage', label: 'Storage' },
  { value: 'total_cost', label: 'Total Cost' },
  { value: 'final_price', label: 'Final Price' },
  { value: 'in_usd', label: 'Price in USD' },
  { value: 'displayed_price', label: 'Displayed Price' },
  { value: 'discount_rate', label: 'Discount Rate' },
  { value: 'profit_margin', label: 'Profit Margin' },
  { value: 'operating_cost', label: 'Operating Cost' }
];

const operators = [
  { value: '+', label: '+' },
  { value: '-', label: '-' },
  { value: '*', label: '×' },
  { value: '/', label: '÷' },
  { value: '%', label: '%' },
];

export function PricingCalculation() {
  const [saved, setSaved] = useState(false);
  const [rules, setRules] = useState<PricingRule[]>([]);

  useEffect(() => {
    setRules(getPricingRules());
  }, []);

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        id: crypto.randomUUID(),
        name: 'New Rule',
        formula: [
          {
            id: crypto.randomUUID(),
            ...defaultFormulaStep,
          },
        ],
        result: 'final_price',
      },
    ]);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleAddFormulaStep = (ruleId: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              formula: [
                ...rule.formula,
                { id: crypto.randomUUID(), ...defaultFormulaStep },
              ],
            }
          : rule
      )
    );
  };

  const handleRemoveFormulaStep = (ruleId: string, stepId: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              formula: rule.formula.filter((step) => step.id !== stepId),
            }
          : rule
      )
    );
  };

  const handleRuleChange = (ruleId: string, updates: Partial<PricingRule>) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const handleFormulaStepChange = (
    ruleId: string,
    stepId: string,
    updates: Partial<FormulaStep>
  ) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              formula: rule.formula.map((step) =>
                step.id === stepId ? { ...step, ...updates } : step
              ),
            }
          : rule
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePricingRules(rules);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Price Calculation Rules
          </h2>
          <button
            type="button"
            onClick={handleAddRule}
            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Rule
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Define calculation rules using mathematical operations between different factors.
        </p>
      </div>

      <div className="space-y-6">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 border border-gray-200 rounded-lg space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <input
                  type="text"
                  value={rule.name}
                  onChange={(e) =>
                    handleRuleChange(rule.id, { name: e.target.value })
                  }
                  placeholder="Rule Name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRule(rule.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {rule.formula.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3">
                  {index === 0 ? (
                    <select
                      value={step.leftOperand}
                      onChange={(e) =>
                        handleFormulaStepChange(rule.id, step.id, {
                          leftOperand: e.target.value,
                        })
                      }
                      className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {pricingFactors.map((factor) => (
                        <option key={factor.value} value={factor.value}>
                          {factor.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-40 text-center text-sm text-gray-500">
                      Previous Result
                    </div>
                  )}

                  <select
                    value={step.operator}
                    onChange={(e) =>
                      handleFormulaStepChange(rule.id, step.id, {
                        operator: e.target.value,
                      })
                    }
                    className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={step.rightOperandType}
                    onChange={(e) =>
                      handleFormulaStepChange(rule.id, step.id, {
                        rightOperandType: e.target.value as 'factor' | 'value',
                        rightOperand:
                          e.target.value === 'factor'
                            ? pricingFactors[0].value
                            : '0',
                      })
                    }
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="factor">Factor</option>
                    <option value="value">Value</option>
                  </select>

                  {step.rightOperandType === 'factor' ? (
                    <select
                      value={step.rightOperand}
                      onChange={(e) =>
                        handleFormulaStepChange(rule.id, step.id, {
                          rightOperand: e.target.value,
                        })
                      }
                      className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {pricingFactors.map((factor) => (
                        <option key={factor.value} value={factor.value}>
                          {factor.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={step.rightOperand}
                      onChange={(e) =>
                        handleFormulaStepChange(rule.id, step.id, {
                          rightOperand: e.target.value,
                        })
                      }
                      className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  )}

                  {rule.formula.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFormulaStep(rule.id, step.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddFormulaStep(rule.id)}
                className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Step
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  Store result in:
                </span>
                <select
                  value={rule.result}
                  onChange={(e) =>
                    handleRuleChange(rule.id, { result: e.target.value })
                  }
                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {pricingFactors.map((factor) => (
                    <option key={factor.value} value={factor.value}>
                      {factor.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 mt-6 pt-6">
        <div className="flex items-center text-sm">
          {saved && (
            <span className="text-green-600 font-medium">
              Calculation rules saved successfully!
            </span>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Rules
        </button>
      </div>
    </form>
  );
}